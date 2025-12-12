#!/bin/bash
# Generate PNG icons from SVG using Python (built-in on macOS)
python3 << 'PYTHON'
from xml.etree import ElementTree as ET
import base64

# Read SVG
with open('icon.svg', 'r') as f:
    svg_content = f.read()

# For placeholder, we'll create simple base64 PNG files
# Since we don't have image libraries, we'll create minimal PNG files

# Minimal PNG header for solid color images (placeholder approach)
def create_simple_png(size):
    # Create a simple canvas using Python PIL if available, otherwise base64 placeholder
    try:
        from PIL import Image, ImageDraw
        
        # Create image with blue background
        img = Image.new('RGB', (size, size), color='#4285f4')
        draw = ImageDraw.Draw(img)
        
        # Draw outer rectangle (screen)
        margin = size // 6
        draw.rectangle(
            [margin, margin + size//10, size - margin, size - margin - size//5],
            outline='white',
            width=max(1, size//20)
        )
        
        # Draw PiP window
        pip_w = size // 3
        pip_h = size // 4
        pip_x = size - margin - pip_w + size//20
        pip_y = size - margin - size//5 - pip_h//2
        draw.rectangle(
            [pip_x, pip_y, pip_x + pip_w, pip_y + pip_h],
            fill='white'
        )
        
        # Draw play triangle
        play_size = size // 8
        play_x = margin + size // 6
        play_y = size // 2
        draw.polygon(
            [
                (play_x, play_y - play_size//2),
                (play_x, play_y + play_size//2),
                (play_x + play_size, play_y)
            ],
            fill='white'
        )
        
        img.save(f'icon{size}.png')
        print(f'Created icon{size}.png')
    except ImportError:
        print(f'PIL not available, skipping icon{size}.png')

for size in [16, 32, 48, 128]:
    create_simple_png(size)
PYTHON
