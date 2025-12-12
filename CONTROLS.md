# PiP Window Controls Guide

## On-Screen UI

When you activate Picture-in-Picture mode, a sleek control panel appears in the **bottom-right corner** of the page.

```
┌─────────────────────────────────────┐
│                                     │
│         [Video in PiP]              │
│                                     │
│                                     │
│                        ┌──────────┐ │
│                        │ S M L XL ✕│ │  ← Controls appear here
│                        └──────────┘ │
└─────────────────────────────────────┘
```

## Control Panel Layout

```
╔═══════════════════════════════════╗
║  [ S ] [ M ] [ L ] [ XL ]  [ ✕ ]  ║  ← Dark glass background
╚═══════════════════════════════════╝
   ↑     ↑     ↑     ↑       ↑
   │     │     │     │       └─ Close PiP
   │     │     │     └───────── Extra Large (854×480)
   │     │     └─────────────── Large (640×360)
   │     └───────────────────── Medium (480×270)
   └─────────────────────────── Small (320×180)
```

## Button Details

### Size Buttons (S, M, L, XL)

| Button | Size | Resolution | Use Case |
|--------|------|------------|----------|
| **S** | Small | 320×180 | Minimal space, background viewing |
| **M** | Medium | 480×270 | Balanced size, multitasking |
| **L** | Large | 640×360 | Comfortable viewing, readable text |
| **XL** | Extra Large | 854×480 | Maximum detail, main focus |

### Close Button (✕)

- **Color**: Red background
- **Action**: Exits Picture-in-Picture mode
- **Alternative**: Press `Ctrl+Shift+P` again or click extension icon

## Visual Design

### Appearance
- **Background**: Dark translucent glass (85% black with blur effect)
- **Border Radius**: 8px rounded corners
- **Shadow**: Soft drop shadow for depth
- **Font**: System native (SF Pro on Mac, Segoe UI on Windows)

### Interactions
- **Hover Effect**: Buttons glow blue and scale up slightly
- **Click Feedback**: Instant resize or close action
- **Smooth Animations**: 200ms transitions

### Auto-Hide Behavior
1. **On Activate**: Controls fade in after 100ms
2. **Active**: Visible for 3 seconds
3. **Auto-Hide**: Fade out to stay unobtrusive
4. **On Hover**: Instantly reappear when mouse moves over controls
5. **On Exit**: Removed when PiP closes

## How to Use

### Quick Resize
1. Enter PiP mode (click icon or `Ctrl+Shift+P`)
2. Move mouse to bottom-right of page
3. Click desired size button (S/M/L/XL)
4. PiP window resizes instantly

### Close from Page
1. Move mouse to bottom-right controls
2. Click red **✕** button
3. PiP exits immediately

### Keyboard Alternative
- Press `Ctrl+Shift+P` (or `⌘+Shift+P`) to toggle PiP on/off
- No need to use controls if you prefer keyboard

## Browser Support

The PiP Window API resize feature requires:
- **Chrome 88+**: Full support
- **Edge 88+**: Full support
- **Opera 74+**: Full support

If `pipWindow.resize()` is not supported, buttons will log a message but won't cause errors.

## Customization

Want different sizes? Edit [background.js](background.js:311):

```javascript
const sizes = [
  { label: 'S', width: 320, height: 180 },
  { label: 'M', width: 480, height: 270 },
  { label: 'L', width: 640, height: 360 },
  { label: 'XL', width: 854, height: 480 }
];
```

Add your own presets:
```javascript
{ label: 'HD', width: 1280, height: 720 }  // Custom HD preset
```

## Tips

✅ **Best Practices**:
- Use **S** for background tasks while working
- Use **M** for balanced viewing during multitasking
- Use **L** for comfortable video watching
- Use **XL** when you need to read small text in videos

⚠️ **Notes**:
- Controls only appear on the original page, not in the PiP window itself
- PiP window position is managed by the browser
- Some sites may interfere with the controls (rare)

## Troubleshooting

### Controls don't appear
- Check that PiP activated successfully (badge shows "PiP")
- Look in bottom-right corner of the **page**, not the PiP window
- Wait 100ms for fade-in animation

### Resize doesn't work
- Browser may not support `pipWindow.resize()` API
- Check console for: "Resize not supported or failed"
- Manually resize the PiP window by dragging corners

### Controls stay visible
- Move mouse away from controls area
- They will auto-hide after 3 seconds
- This is normal behavior

### Controls block content
- They have `z-index: 999999` to stay on top
- Auto-hide feature minimizes interference
- Exit PiP if needed

## Examples

### Scenario 1: Tutorial Video
```
1. Start tutorial video on YouTube
2. Activate PiP (Ctrl+Shift+P)
3. Click [L] for comfortable viewing
4. Follow along with code on main screen
```

### Scenario 2: Live Stream
```
1. Open Twitch stream
2. Activate PiP
3. Click [S] for compact background viewing
4. Work on other tasks while stream plays
```

### Scenario 3: Video Conference
```
1. Join Zoom/Meet in browser
2. Activate PiP on speaker's video
3. Click [M] for balanced size
4. Take notes in other window
```

---

**Pro Tip**: Combine with Chrome's native window management (Snap Assist, Mission Control) for ultimate multitasking!
