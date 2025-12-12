# PiP Anywhere

A production-ready Chrome extension that toggles Picture-in-Picture mode for any HTML5 video with intelligent video detection, robust error handling, and user feedback.

## Features

- **Smart Video Detection**: Finds the best video candidate using intelligent scoring
  - Prioritizes currently playing videos (10,000 pts)
  - Largest visible area (area-based scoring)
  - Videos with valid duration (1,000 pts bonus)
  - In-viewport videos (500 pts bonus)
  - Active videos with playback progress (200 pts bonus)
  - Scans light DOM, Shadow DOM, and same-origin iframes

- **Robust PiP Handling**:
  - Runs with proper user activation context (MAIN world injection)
  - Removes `disablePictureInPicture` and `controlsList="nopictureinpicture"` blocks
  - Exits existing PiP before entering new one
  - Fallback to next-best candidates if primary fails
  - Frame-by-frame error isolation (cross-origin failures don't stop execution)

- **User Feedback**:
  - Badge indicator: "PiP" (blue) when active, "OFF" (gray) when exited, "✗" (red) on error
  - Desktop notifications when no video found or PiP blocked
  - Console logging for debugging

- **PiP Window Controls**:
  - On-screen resize buttons (S, M, L, XL) for quick size adjustments
  - Close button (✕) to exit PiP from the page
  - Auto-hide after 3 seconds, reappear on hover
  - Smooth animations and modern design

- **Two Activation Methods**:
  - Click toolbar icon
  - Press `Ctrl+Shift+P` (Windows/Linux) or `Command+Shift+P` (Mac)

## Installation

### Load as Unpacked Extension (Developer Mode)

1. **Clone or download** this repository to your local machine

2. **Open Chrome Extensions**:
   - Navigate to `chrome://extensions/`
   - Or Menu → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the switch in the top-right corner

4. **Load the Extension**:
   - Click "Load unpacked"
   - Select the `pipanywhere` folder containing `manifest.json`

5. **Pin the Extension** (recommended):
   - Click the puzzle piece icon in the toolbar
   - Find "PiP Anywhere" and click the pin icon

6. **Verify Keyboard Shortcut**:
   - Go to `chrome://extensions/shortcuts`
   - Find "PiP Anywhere" → "Toggle Picture-in-Picture"
   - Confirm shortcut is `Ctrl+Shift+P` (or customize it)

## Usage

### Toolbar Button
1. Navigate to any page with video (YouTube, Vimeo, Netflix, etc.)
2. Click the PiP Anywhere toolbar icon
3. The best video will enter Picture-in-Picture mode
4. Use on-screen controls to resize (S/M/L/XL) or close (✕)
5. Click toolbar icon again to exit PiP

### Keyboard Shortcut
1. Navigate to any page with video
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Command+Shift+P` (Mac)
3. Toggle behavior same as toolbar button

### PiP Window Controls

When a video enters PiP mode, on-screen controls appear in the bottom-right corner:

**Size Presets**:
- **S** - Small (320×180) - Compact viewing
- **M** - Medium (480×270) - Balanced size
- **L** - Large (640×360) - Comfortable viewing
- **XL** - Extra Large (854×480) - Maximum detail

**Controls Behavior**:
- Appear automatically when PiP activates
- Auto-hide after 3 seconds (move mouse over to reveal)
- Smooth hover animations
- Click **✕** to close PiP from the page

### Visual Feedback

**Badge States**:
- **"PiP"** (blue) - Video successfully entered PiP mode
- **"OFF"** (gray) - Exited PiP mode
- **"✗"** (red) - Error (no video found or PiP blocked)

**Notifications**:
- Displays when no suitable video is found
- Shows specific error messages (e.g., "PiP blocked by site")

## How It Works

### Video Scoring Algorithm

The extension ranks videos based on:

1. **Playing State** (+10,000) - Active videos are top priority
2. **Visible Area** (width × height) - Larger videos preferred
3. **Duration** (+1,000) - Videos with valid duration (not live/infinite)
4. **Viewport** (+500) - Videos currently visible on screen
5. **Playback Progress** (+200) - Videos that have been watched (currentTime > 0)

Invisible videos (hidden, display:none, opacity:0) are filtered out.

### Technical Highlights

- **User Activation Context**: Injects code in `world: 'MAIN'` to preserve click/keyboard activation
- **Shadow DOM Support**: Recursively scans shadow roots for embedded video players
- **Attribute Stripping**: Removes `disablePictureInPicture` and `controlsList` restrictions
- **Graceful Degradation**: Tries main frame first, then iframes; ignores cross-origin errors
- **Multi-candidate Fallback**: Attempts up to 3 best-scored videos before giving up
- **Dynamic Controls**: On-screen UI with size presets and auto-hide functionality
- **PiP Window API**: Uses `pipWindow.resize()` for programmatic size control

### Tested Sites

✅ **Working:**
- YouTube (standard player & embeds)
- Vimeo
- Twitch
- Twitter/X video players
- Netflix (basic support)
- HTML5 video players
- Sites with Shadow DOM video players
- Multiple videos on one page

⚠️ **Limitations:**
- DRM-protected videos may block PiP (site policy)
- Cross-origin iframes with restrictive CSP
- Sites that dynamically disable PiP on detection

## File Structure

```
pipanywhere/
├── manifest.json          # Manifest V3 configuration
├── background.js          # Service worker (action/command handlers + UI controls)
├── icons/                 # Extension icons (16/32/48/128px)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # Main documentation
├── INSTALL.md             # Quick install & test guide
├── CONTROLS.md            # PiP window controls guide (NEW!)
└── TROUBLESHOOTING.md     # Error fixes & debugging
```

## Permissions

- **activeTab** - Access current tab to find videos
- **scripting** - Inject toggle script into pages
- **notifications** - Show error/info notifications
- **host_permissions (`<all_urls>`)** - Work on any website

**Privacy**: No data collection, no remote servers, all processing is local.

## Troubleshooting

### "No video elements found on page"
- Ensure video is loaded and visible
- Try playing the video first
- Check if video is in a cross-origin iframe (not accessible)

### "PiP failed: Permission denied"
- Site may have `disablePictureInPicture` set (extension tries to remove it)
- Browser policy may block PiP on certain sites
- Try refreshing the page and toggle again

### Keyboard shortcut doesn't work
- Check for conflicts: `chrome://extensions/shortcuts`
- Some sites override keyboard shortcuts
- Try clicking the toolbar icon instead

### Badge shows "✗" (error)
- Check notification message for details
- Open DevTools Console (F12) for detailed error logs
- Video may be DRM-protected or hidden

### Multiple videos on page
- Extension automatically picks the best one (usually the playing/largest)
- To toggle a different video, pause others first

## Development

### Testing Changes

1. Edit `background.js` or update `manifest.json`
2. Go to `chrome://extensions/`
3. Click refresh icon on "PiP Anywhere" card
4. Test on a video page

### Debug Logging

Open DevTools (F12) on any video page and check Console for:
- `PiP toggle failed:` - Service worker errors
- Video scoring details (if you add logging)
- User activation state

### Customizing Keyboard Shortcut

Users can change the shortcut at `chrome://extensions/shortcuts`:
- Click in the shortcut field
- Press desired key combination
- Avoid conflicts with browser/OS shortcuts

## Technical Architecture

### Service Worker (`background.js`)

- Listens to `chrome.action.onClicked` and `chrome.commands.onCommand`
- Injects toggle function into page using `world: 'MAIN'` (preserves user activation)
- Handles badge updates and notifications
- Manages frame-by-frame injection (main frame first, then iframes)

### Injection Strategy

1. **Function Injection**: `injectPipToggleFunction()` defines `window.__pipAnywhereToggle`
2. **Execution**: `executePipToggle()` calls the function with user activation
3. **Main Frame First**: Try main document before iframes
4. **Iframe Fallback**: Inject into all frames with `allFrames: true`, ignore errors
5. **Result Aggregation**: Check all frame results, succeed on first match

### User Activation

Chrome requires PiP requests to have "transient user activation" (recent click/keypress). By injecting in `world: 'MAIN'` during the click/command handler, the activation is preserved.

## Known Issues

- **Cross-origin iframes**: Cannot access videos in iframes from different domains (browser security)
- **Dynamically loaded videos**: Videos added after injection may not be detected (refresh/re-toggle)
- **Fullscreen conflicts**: Some sites may interfere with PiP when in fullscreen mode

## Contributing

Found a bug or have a feature request? Issues and PRs welcome!

## License

MIT License - Free to use and modify.

---

**Version**: 1.0.0
**Manifest**: V3
**Minimum Chrome**: 88+
**Last Updated**: 2025-12-12
