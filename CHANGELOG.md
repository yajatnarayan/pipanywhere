# Changelog

## [1.1.0] - 2025-12-12 - UI Controls Update

### ✨ Added
- **On-screen PiP controls** with modern glass-morphism design
  - Size preset buttons: S (320×180), M (480×270), L (640×360), XL (854×480)
  - Close button (✕) for quick PiP exit
  - Auto-hide behavior (3 seconds, reappear on hover)
  - Smooth hover animations with blue glow effect
  - Dark translucent background with blur effect

- **PiP Window API Integration**
  - Uses `pipWindow.resize()` for programmatic size control
  - Resize event logging for debugging
  - Graceful fallback if API not supported

- **Enhanced User Experience**
  - Controls appear in bottom-right corner of page
  - Fade-in animation on PiP enter
  - Auto-cleanup on PiP exit
  - High z-index (999999) ensures visibility

### 📚 Documentation
- Added `CONTROLS.md` - Comprehensive guide to PiP window controls
- Updated `README.md` with controls section and usage examples
- Updated `INSTALL.md` with resize testing steps
- Added visual diagrams and use case examples

### 🔧 Technical
- Extended `injectPipToggleFunction()` with `addPipControls()` helper
- ES5-compatible syntax for broader browser support
- Event-driven cleanup with `leavepictureinpicture` listener
- Timeout-based auto-hide with mouse event handling

### 📊 Metrics
- File size: `background.js` increased from 8.5KB → 13KB (+53%)
- Added ~150 lines of UI control logic
- Zero external dependencies maintained

---

## [1.0.0] - 2025-12-12 - Initial Release

### ✨ Features
- **Smart Video Detection**
  - Multi-factor scoring algorithm (playing, size, viewport, duration)
  - Light DOM, Shadow DOM, and same-origin iframe scanning
  - Automatic best-candidate selection

- **Robust PiP Toggle**
  - User activation preservation via `world: 'MAIN'` injection
  - Removes `disablePictureInPicture` and `controlsList` blocks
  - Multi-candidate fallback (tries top 3 videos)
  - Frame-by-frame error isolation

- **User Feedback**
  - Badge states: "PiP" (blue), "OFF" (gray), "✗" (red)
  - Desktop notifications for errors
  - Auto-clear error badges

- **Dual Activation**
  - Toolbar button click
  - Keyboard shortcut: `Ctrl+Shift+P` / `⌘+Shift+P`

### 🔧 Technical
- Manifest V3 compliant
- Service worker architecture
- No external dependencies
- No remote code execution

### 📚 Documentation
- Comprehensive README with installation steps
- Quick install guide (INSTALL.md)
- Troubleshooting guide
- Verification script (verify.sh)

### ✅ Browser Support
- Chrome 88+
- Edge 88+
- Opera 74+

---

## Development Notes

### Why Version 1.1.0?

The UI controls feature is a **minor version bump** because:
- ✅ Adds new user-facing functionality (resize controls)
- ✅ Backwards compatible (no breaking changes)
- ✅ Enhances existing feature (PiP) without changing core behavior
- ✅ Optional enhancement (extension works fine without using controls)

### Breaking Changes
None. Version 1.1.0 is fully backwards compatible with 1.0.0.

### Migration Guide
No migration needed. Simply reload the extension:
1. Remove extension at `chrome://extensions/`
2. Load unpacked from updated folder
3. Test on YouTube to see new controls

### Future Roadmap

**Planned Features:**
- [ ] Custom size input (user-defined dimensions)
- [ ] Position presets (corner placement)
- [ ] Keyboard shortcuts for size changes
- [ ] Remember last used size preference
- [ ] Theme customization (light/dark modes)
- [ ] Multi-monitor support improvements

**Under Consideration:**
- [ ] Draggable controls panel
- [ ] Opacity slider for PiP window
- [ ] Playback speed controls
- [ ] Volume controls in PiP

**Won't Implement:**
- ❌ Inside-PiP controls (browser limitation)
- ❌ Cross-origin iframe forced access (security violation)
- ❌ DRM bypass (illegal)

---

## Credits

**Version 1.1.0 UI Controls**:
- Design inspired by modern macOS/iOS control panels
- Glass-morphism aesthetic with backdrop blur
- Accessibility-focused hover states and button sizing

**Version 1.0.0 Core**:
- Based on Chrome Picture-in-Picture API
- Service worker pattern from Manifest V3 migration guide
- Scoring algorithm optimized through testing on major video sites

---

**License**: MIT
**Maintainer**: Senior Chrome Extension Engineer
**Last Updated**: 2025-12-12
