// Service worker for PiP Anywhere extension

// Handle toolbar button clicks
chrome.action.onClicked.addListener(async (tab) => {
  await togglePiP(tab.id);
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-pip') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await togglePiP(tab.id);
    }
  }
});

async function togglePiP(tabId) {
  try {
    // Clear any previous badge
    await chrome.action.setBadgeText({ tabId, text: '' });

    // Inject helper function first into main frame
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      func: injectPipToggleFunction,
      world: 'MAIN'
    });

    // Execute toggle in main frame with user activation context
    const mainResults = await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      func: executePipToggle,
      world: 'MAIN'
    });

    const mainResult = mainResults?.[0]?.result;

    // If main frame found and toggled video, we're done
    if (mainResult?.success) {
      if (mainResult.action === 'exited') {
        await showBadge(tabId, 'OFF', '#666666');
      } else {
        await showBadge(tabId, 'PiP', '#4285f4');
      }
      return;
    }

    // Try iframes with matchAboutBlank, ignore individual frame errors
    try {
      await chrome.scripting.executeScript({
        target: { tabId, allFrames: true },
        func: injectPipToggleFunction,
        world: 'MAIN'
      });

      const iframeResults = await chrome.scripting.executeScript({
        target: { tabId, allFrames: true },
        func: executePipToggle,
        world: 'MAIN'
      });

      // Check if any iframe succeeded
      const successfulFrame = iframeResults?.find(r => r.result?.success);
      if (successfulFrame) {
        if (successfulFrame.result.action === 'exited') {
          await showBadge(tabId, 'OFF', '#666666');
        } else {
          await showBadge(tabId, 'PiP', '#4285f4');
        }
        return;
      }
    } catch (iframeError) {
      // Some frames may fail, continue to show error
      console.log('Some iframes failed (expected for cross-origin):', iframeError.message);
    }

    // No video found or all attempts failed
    const errorMsg = mainResult?.error || 'No suitable video found';
    await showBadge(tabId, '✗', '#ea4335');

    // Show notification for better UX
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'PiP Anywhere',
      message: errorMsg,
      priority: 1
    });

    // Clear error badge after 2 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ tabId, text: '' });
    }, 2000);

  } catch (error) {
    console.error('PiP toggle failed:', error);
    await showBadge(tabId, '✗', '#ea4335');

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'PiP Anywhere Error',
      message: error.message || 'Failed to toggle PiP',
      priority: 1
    });

    setTimeout(() => {
      chrome.action.setBadgeText({ tabId, text: '' });
    }, 2000);
  }
}

async function showBadge(tabId, text, color) {
  await chrome.action.setBadgeText({ tabId, text });
  await chrome.action.setBadgeBackgroundColor({ tabId, color });
}

// This function runs in MAIN world with user activation
function injectPipToggleFunction() {
  // Skip if already defined
  if (window.__pipAnywhereToggle) return;

  // Define the toggle function
  window.__pipAnywhereToggle = async function() {
    try {
      // If PiP is active anywhere, exit it first
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return { success: true, action: 'exited' };
      }

      // Find all videos including shadow DOM and iframes
      const videos = [];

      // Helper to collect videos from a root
      function collectVideos(root) {
        const localVideos = Array.from(root.querySelectorAll('video'));
        videos.push(...localVideos);

        // Check shadow roots
        const elementsWithShadow = Array.from(root.querySelectorAll('*'))
          .filter(function(el) { return el.shadowRoot; });

        for (let i = 0; i < elementsWithShadow.length; i++) {
          collectVideos(elementsWithShadow[i].shadowRoot);
        }
      }

      // Collect from main document
      collectVideos(document);

      // Collect from same-origin iframes
      const iframes = Array.from(document.querySelectorAll('iframe'));
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        try {
          const iframeDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
          if (iframeDoc) {
            collectVideos(iframeDoc);
          }
        } catch (e) {
          // Cross-origin iframe, skip
        }
      }

      if (videos.length === 0) {
        return { success: false, error: 'No video elements found on page' };
      }

      // Score and rank videos
      const scoredVideos = videos.map(function(video) {
        let score = 0;

        // Check visibility
        const rect = video.getBoundingClientRect();
        const style = window.getComputedStyle(video);
        const isVisible = rect.width > 0 && rect.height > 0 &&
                         video.offsetParent !== null &&
                         style.display !== 'none' &&
                         style.visibility !== 'hidden' &&
                         style.opacity !== '0';

        if (!isVisible) return { video: video, score: -1 };

        // High priority: currently playing
        if (!video.paused && !video.ended) {
          score += 10000;
        }

        // Size matters: larger visible area
        const area = rect.width * rect.height;
        score += area;

        // Prefer videos with valid duration
        if (video.duration && isFinite(video.duration) && video.duration > 0) {
          score += 1000;
        }

        // Bonus for videos in viewport
        const inViewport = rect.top < window.innerHeight &&
                          rect.bottom > 0 &&
                          rect.left < window.innerWidth &&
                          rect.right > 0;
        if (inViewport) {
          score += 500;
        }

        // Bonus for videos that have been interacted with
        if (video.currentTime > 0) {
          score += 200;
        }

        return { video: video, score: score };
      });

      // Filter and sort
      const viableVideos = scoredVideos
        .filter(function(v) { return v.score >= 0; })
        .sort(function(a, b) { return b.score - a.score; });

      if (viableVideos.length === 0) {
        return { success: false, error: 'No visible videos found on page' };
      }

      // Try best candidates
      const maxAttempts = Math.min(3, viableVideos.length);
      for (let i = 0; i < maxAttempts; i++) {
        const video = viableVideos[i].video;

        try {
          // Remove PiP blocking attributes
          video.removeAttribute('disablePictureInPicture');

          const controlsList = video.getAttribute('controlsList');
          if (controlsList) {
            const items = controlsList.split(' ');
            const newList = items.filter(function(item) {
              return item !== 'nopictureinpicture';
            }).join(' ');

            if (newList) {
              video.setAttribute('controlsList', newList);
            } else {
              video.removeAttribute('controlsList');
            }
          }

          // Request PiP - this has user activation from click/command
          const pipWindow = await video.requestPictureInPicture();

          // Add resize controls to PiP window
          addPipControls(video, pipWindow);

          return {
            success: true,
            action: 'entered',
            videoInfo: {
              src: video.currentSrc || video.src,
              duration: video.duration,
              paused: video.paused
            }
          };

        } catch (error) {
          // Try next candidate
          if (i === maxAttempts - 1) {
            return {
              success: false,
              error: 'PiP failed: ' + error.message
            };
          }
          continue;
        }
      }

      return { success: false, error: 'All video candidates failed PiP request' };

    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add resize controls to PiP window
  function addPipControls(video, pipWindow) {
    // Create control overlay
    const controlsContainer = document.createElement('div');
    controlsContainer.id = '__pip-anywhere-controls';
    controlsContainer.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 8px;
      display: flex;
      gap: 6px;
      align-items: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;
    `;

    // Size presets
    const sizes = [
      { label: 'S', width: 320, height: 180 },
      { label: 'M', width: 480, height: 270 },
      { label: 'L', width: 640, height: 360 },
      { label: 'XL', width: 854, height: 480 }
    ];

    // Create size buttons
    sizes.forEach(function(size) {
      const btn = document.createElement('button');
      btn.textContent = size.label;
      btn.style.cssText = `
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
        transition: all 0.2s ease;
        min-width: 32px;
      `;
      btn.onmouseover = function() {
        btn.style.background = 'rgba(66, 133, 244, 0.8)';
        btn.style.borderColor = 'rgba(66, 133, 244, 1)';
        btn.style.transform = 'scale(1.05)';
      };
      btn.onmouseout = function() {
        btn.style.background = 'rgba(255, 255, 255, 0.15)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        btn.style.transform = 'scale(1)';
      };
      btn.onclick = function() {
        try {
          pipWindow.resize(size.width, size.height);
        } catch (e) {
          console.log('Resize not supported or failed:', e.message);
        }
      };
      controlsContainer.appendChild(btn);
    });

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: rgba(234, 67, 53, 0.8);
      border: 1px solid rgba(234, 67, 53, 1);
      color: white;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s ease;
      margin-left: 4px;
    `;
    closeBtn.onmouseover = function() {
      closeBtn.style.background = 'rgba(234, 67, 53, 1)';
      closeBtn.style.transform = 'scale(1.05)';
    };
    closeBtn.onmouseout = function() {
      closeBtn.style.background = 'rgba(234, 67, 53, 0.8)';
      closeBtn.style.transform = 'scale(1)';
    };
    closeBtn.onclick = function() {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };
    controlsContainer.appendChild(closeBtn);

    document.body.appendChild(controlsContainer);

    // Show controls on PiP enter
    setTimeout(function() {
      controlsContainer.style.opacity = '1';
      controlsContainer.style.pointerEvents = 'auto';
    }, 100);

    // Auto-hide after 3 seconds, show on hover
    let hideTimeout;
    function scheduleHide() {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(function() {
        controlsContainer.style.opacity = '0';
        controlsContainer.style.pointerEvents = 'none';
      }, 3000);
    }

    scheduleHide();

    controlsContainer.onmouseenter = function() {
      clearTimeout(hideTimeout);
      controlsContainer.style.opacity = '1';
      controlsContainer.style.pointerEvents = 'auto';
    };

    controlsContainer.onmouseleave = function() {
      scheduleHide();
    };

    // Remove controls when PiP exits
    video.addEventListener('leavepictureinpicture', function() {
      if (controlsContainer && controlsContainer.parentNode) {
        controlsContainer.parentNode.removeChild(controlsContainer);
      }
    }, { once: true });

    // Handle PiP window resize events
    if (pipWindow.onresize !== undefined) {
      pipWindow.onresize = function() {
        console.log('PiP window resized to:', pipWindow.width, 'x', pipWindow.height);
      };
    }
  }
}

// Execute the toggle function (runs with user activation in MAIN world)
function executePipToggle() {
  if (typeof window.__pipAnywhereToggle === 'function') {
    return window.__pipAnywhereToggle();
  }
  return { success: false, error: 'Toggle function not initialized' };
}
