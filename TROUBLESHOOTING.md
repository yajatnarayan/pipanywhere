# Troubleshooting: Syntax Error Fix

## Error: "content.js:24 Uncaught SyntaxError: Missing initializer in const declaration"

This error appears when Chrome has cached the old content.js file. The new version doesn't use content.js anymore (all logic is in background.js).

### Fix Steps:

1. **Go to Chrome Extensions**
   ```
   chrome://extensions/
   ```

2. **Remove the Extension**
   - Find "PiP Anywhere"
   - Click "Remove"
   - Confirm removal

3. **Clear Extension Cache** (optional but recommended)
   - Close all Chrome windows
   - Reopen Chrome

4. **Reload the Extension**
   - Click "Load unpacked"
   - Select `/Users/Patron/pipanywhere` folder

5. **Verify Files**
   - Check that only these files exist:
     ```
     pipanywhere/
     ├── manifest.json
     ├── background.js
     ├── icons/
     │   ├── icon16.png
     │   ├── icon32.png
     │   ├── icon48.png
     │   └── icon128.png
     ├── README.md
     ├── INSTALL.md
     └── TROUBLESHOOTING.md
     ```
   - **No content.js should exist**

### Alternative: Hard Refresh

If you don't want to remove/reload:

1. Go to `chrome://extensions/`
2. Find "PiP Anywhere"
3. Click the refresh icon (circular arrow)
4. If error persists, use the Remove/Reload method above

### Verify It Works

1. Go to YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. Play video
3. Click extension icon or press `Ctrl+Shift+P` (Mac: `⌘+Shift+P`)
4. Should see:
   - ✅ Video enters PiP
   - ✅ Badge shows "PiP" (blue)
   - ✅ No console errors

### Still Getting Errors?

Check the Service Worker console:

1. `chrome://extensions/`
2. Find "PiP Anywhere"
3. Click "service worker" link
4. Check for errors in the console

Common issues:
- **"Toggle function not initialized"** → Page needs user interaction first (click on page before toggling)
- **"No video elements found"** → Correct behavior on pages without video
- **"PiP failed: Permission denied"** → Site blocks PiP (expected on some sites)

### Debug Mode

To see detailed logs:

1. Open DevTools on the video page (F12)
2. Go to Console tab
3. Trigger the extension
4. Look for:
   - `Some iframes failed` (normal for cross-origin)
   - Video scoring information
   - Success/error messages

### File Verification

Verify content.js doesn't exist:

```bash
cd /Users/Patron/pipanywhere
ls -la
# Should NOT see content.js in the list
```

If content.js exists:
```bash
rm content.js
# Then reload extension in Chrome
```

### Fresh Install

Complete fresh install:

```bash
cd /Users/Patron/pipanywhere
rm -rf .git  # optional: remove git history if it exists
ls -la       # verify only correct files exist
```

Then in Chrome:
1. Remove extension completely
2. Restart Chrome
3. Load unpacked again
