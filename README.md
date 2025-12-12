# PiP Anywhere

A Chrome extension that lets you toggle Picture-in-Picture mode for any HTML5 video on any webpage with a single click or keyboard shortcut.

## Features

- **Smart Video Detection**: Automatically finds the best video candidate on the page
  - Prioritizes currently playing videos
  - Chooses largest visible video if multiple exist
  - Scans iframes for embedded videos (YouTube, Vimeo, etc.)
  - Handles multiple videos intelligently

- **Easy Toggle**: Click the toolbar icon or press `Ctrl+Shift+P` (Windows/Linux) or `Command+Shift+P` (Mac)

- **Works Everywhere**: Compatible with YouTube, Vimeo, Netflix, and any site with HTML5 video players

- **Manifest V3**: Future-proof implementation using the latest Chrome extension standards

## Installation

### Load as Unpacked Extension (Developer Mode)

1. **Download or Clone** this repository to your local machine

2. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/`
   - Or click the three-dot menu → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**:
   - Click "Load unpacked" button
   - Select the `pipanywhere` folder containing `manifest.json`

5. **Pin the Extension** (optional):
   - Click the puzzle piece icon in Chrome toolbar
   - Find "PiP Anywhere" and click the pin icon

## Usage

### Method 1: Toolbar Button
- Click the PiP Anywhere icon in your Chrome toolbar
- The best video on the current page will enter Picture-in-Picture mode
- Click again to exit PiP mode

### Method 2: Keyboard Shortcut
- Press `Ctrl+Shift+P` (Windows/Linux) or `Command+Shift+P` (Mac)
- Same toggle behavior as the toolbar button

### How It Works

The extension intelligently selects videos based on:
1. **Playing state**: Videos currently playing are preferred
2. **Size**: Larger videos are prioritized over smaller ones
3. **Visibility**: Only visible videos are considered
4. **Location**: Videos in the viewport get slight preference

### Tested Sites

- YouTube
- Vimeo
- Twitch
- Netflix
- Twitter/X video players
- Generic HTML5 video players
- Sites with embedded iframes

## File Structure

```
pipanywhere/
├── manifest.json      # Extension configuration (Manifest V3)
├── background.js      # Service worker (handles toolbar clicks)
├── content.js         # Video detection and PiP toggle logic
├── icons/             # Extension icons (16, 32, 48, 128px)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

## Permissions

- **activeTab**: Access the current tab to find and control videos
- **scripting**: Inject the content script to interact with page videos
- **host_permissions (`<all_urls>`)**: Work on any website

No data is collected or transmitted. All processing happens locally in your browser.

## Troubleshooting

**No video found**:
- Make sure the video is visible on the page
- Try playing the video first, then toggle PiP
- Some videos may be protected by DRM and don't support PiP

**Cross-origin iframe videos**:
- Videos in cross-origin iframes may not be accessible due to browser security
- The extension will work with same-origin iframes and most embedded players

**Keyboard shortcut conflicts**:
- If `Ctrl+Shift+P` conflicts with another extension, change it at `chrome://extensions/shortcuts`

## Development

To modify the extension:

1. Edit the source files ([manifest.json](manifest.json), [background.js](background.js), [content.js](content.js))
2. Go to `chrome://extensions/`
3. Click the refresh icon on the PiP Anywhere card
4. Test your changes

## Technical Details

- **Manifest Version**: 3
- **Service Worker**: Lightweight background script for action clicks
- **Content Script**: Injected on-demand (not persistent) to minimize memory usage
- **No External Dependencies**: Pure vanilla JavaScript
- **No Remote Code**: All code is local and auditable

## License

MIT License - Feel free to modify and distribute.

## Contributing

Found a bug or have a feature request? Contributions are welcome!

---

**Version**: 1.0.0
**Author**: Senior Chrome Extension Engineer
