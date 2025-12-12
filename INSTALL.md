# Quick Install & Test Guide

## Installation (2 minutes)

1. **Open Chrome Extensions**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle switch in top-right corner

3. **Load Extension**
   - Click "Load unpacked"
   - Select: `/Users/Patron/pipanywhere`

4. **Pin Extension** (optional but recommended)
   - Click puzzle icon in toolbar
   - Pin "PiP Anywhere"

5. **Verify Shortcut**
   ```
   chrome://extensions/shortcuts
   ```
   - Find "PiP Anywhere" → should show `Ctrl+Shift+P` or `⌘+Shift+P`

## Quick Test

### Test 1: YouTube (with resize controls)
1. Go to: https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. Play the video
3. Click extension icon OR press `Ctrl+Shift+P` (Mac: `⌘+Shift+P`)
4. **Expected**:
   - Video enters PiP mode
   - Badge shows "PiP" (blue)
   - Controls appear in bottom-right corner (S/M/L/XL/✕)
5. Try clicking **M**, **L**, **XL** buttons to resize the PiP window
6. **Expected**: PiP window resizes to preset dimensions
7. Click **✕** button OR press shortcut again
8. **Expected**: Exit PiP, badge shows "OFF" (gray)

### Test 2: Multiple Videos
1. Go to any page with multiple videos (e.g., Twitter feed)
2. Start playing one video
3. Trigger extension
4. **Expected**: Playing video enters PiP (highest priority)

### Test 3: Error Handling
1. Go to a page with no video (e.g., google.com)
2. Trigger extension
3. **Expected**:
   - Badge shows "✗" (red) for 2 seconds
   - Notification: "No video elements found on page"

### Test 4: Blocked Video
1. Find a site with `disablePictureInPicture` attribute
2. Trigger extension
3. **Expected**: Extension removes attribute and PiP works (or shows error if browser policy blocks it)

## Badge States

- **"PiP"** (blue) = Successfully entered PiP
- **"OFF"** (gray) = Exited PiP
- **"✗"** (red) = Error (clears after 2s)
- **(empty)** = Idle state

## Debugging

Open DevTools (F12) and check Console for:
- `PiP toggle failed:` errors
- `Some iframes failed` (normal for cross-origin)
- Video detection details

## Common Issues

**"Cannot read properties of undefined"**
→ Refresh the extension at `chrome://extensions/`

**Keyboard shortcut doesn't work**
→ Check `chrome://extensions/shortcuts` for conflicts

**No notification appears**
→ Check Chrome notification permissions

## Testing Different Sites

- ✅ YouTube: https://youtube.com
- ✅ Vimeo: https://vimeo.com
- ✅ Twitch: https://twitch.tv
- ✅ Twitter: https://twitter.com (video posts)
- ✅ HTML5 demo: https://www.w3schools.com/html/html5_video.asp

## Success Criteria

- ✅ Toolbar icon click toggles PiP
- ✅ Keyboard shortcut works
- ✅ Badge updates correctly
- ✅ Notifications appear on errors
- ✅ Works on YouTube and other major sites
- ✅ Handles multiple videos intelligently
- ✅ Gracefully handles pages with no video
