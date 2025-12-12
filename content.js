// Content script for finding and toggling PiP on videos
(async () => {
  // Check if PiP is already active globally
  if (document.pictureInPictureElement) {
    try {
      await document.exitPictureInPicture();
      console.log('Exited Picture-in-Picture');
      return;
    } catch (error) {
      console.error('Failed to exit PiP:', error);
      return;
    }
  }

  // Find all video elements including those in iframes
  const videos = [];

  // Get videos in current frame
  const localVideos = Array.from(document.querySelectorAll('video'));
  videos.push(...localVideos);

  // Get videos from iframes (same-origin only)
  const iframes = Array.from(document.querySelectorAll('iframe'));
  for (const iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const iframeVideos = Array.from(iframeDoc.querySelectorAll('video'));
        videos.push(...iframeVideos);
      }
    } catch (e) {
      // Cross-origin iframe, skip
    }
  }

  if (videos.length === 0) {
    console.log('No video elements found on page');
    return;
  }

  // Score and rank videos to find the best candidate
  const scoredVideos = videos.map(video => {
    let score = 0;

    // Check if video is visible
    const rect = video.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0 &&
                     video.offsetParent !== null &&
                     getComputedStyle(video).display !== 'none' &&
                     getComputedStyle(video).visibility !== 'hidden';

    if (!isVisible) return { video, score: -1 };

    // Prefer playing videos
    if (!video.paused && !video.ended) {
      score += 1000;
    }

    // Prefer videos with larger visible area
    const area = rect.width * rect.height;
    score += area;

    // Prefer videos with duration (not live/infinite)
    if (video.duration && isFinite(video.duration) && video.duration > 0) {
      score += 500;
    }

    // Slight preference for videos in viewport
    const inViewport = rect.top >= 0 && rect.left >= 0 &&
                      rect.bottom <= window.innerHeight &&
                      rect.right <= window.innerWidth;
    if (inViewport) {
      score += 100;
    }

    return { video, score };
  });

  // Filter out invisible videos and sort by score
  const viableVideos = scoredVideos
    .filter(v => v.score >= 0)
    .sort((a, b) => b.score - a.score);

  if (viableVideos.length === 0) {
    console.log('No visible videos found on page');
    return;
  }

  // Get the best candidate
  const bestVideo = viableVideos[0].video;

  try {
    await bestVideo.requestPictureInPicture();
    console.log('Entered Picture-in-Picture mode');
  } catch (error) {
    console.error('Failed to enter PiP:', error);

    // Try the next best candidate if available
    if (viableVideos.length > 1) {
      console.log('Trying next best video candidate...');
      try {
        await viableVideos[1].video.requestPictureInPicture();
        console.log('Entered Picture-in-Picture mode with fallback video');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  }
})();
