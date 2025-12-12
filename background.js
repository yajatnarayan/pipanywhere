// Service worker for PiP Anywhere extension

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Inject and execute the content script to toggle PiP
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['content.js']
    });
  } catch (error) {
    console.error('Failed to inject content script:', error);
  }
});
