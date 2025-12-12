#!/bin/bash
# Verification script for PiP Anywhere extension

echo "🔍 Verifying PiP Anywhere Extension Files..."
echo ""

# Check required files exist
REQUIRED_FILES=(
  "manifest.json"
  "background.js"
  "icons/icon16.png"
  "icons/icon32.png"
  "icons/icon48.png"
  "icons/icon128.png"
  "README.md"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
    echo "❌ Missing: $file"
  else
    echo "✅ Found: $file"
  fi
done

echo ""

# Check that content.js does NOT exist (it's deprecated)
if [ -f "content.js" ]; then
  echo "⚠️  WARNING: content.js exists but should be removed!"
  echo "   Run: rm content.js"
  echo ""
fi

# Verify manifest.json is valid JSON
if command -v python3 &> /dev/null; then
  if python3 -c "import json; json.load(open('manifest.json'))" 2>/dev/null; then
    echo "✅ manifest.json is valid JSON"
  else
    echo "❌ manifest.json has JSON syntax errors"
  fi
else
  echo "⚠️  Cannot verify JSON (python3 not found)"
fi

# Check background.js syntax
if command -v node &> /dev/null; then
  if node -c background.js 2>/dev/null; then
    echo "✅ background.js has valid JavaScript syntax"
  else
    echo "❌ background.js has syntax errors"
  fi
else
  echo "⚠️  Cannot verify JS syntax (node not found)"
fi

echo ""
echo "📊 File Sizes:"
ls -lh manifest.json background.js README.md 2>/dev/null | awk '{print "  " $9 ": " $5}'

echo ""
if [ ${#MISSING_FILES[@]} -eq 0 ]; then
  echo "✅ All required files present!"
  echo ""
  echo "📋 Next Steps:"
  echo "  1. Go to chrome://extensions/"
  echo "  2. Enable Developer Mode"
  echo "  3. Click 'Load unpacked'"
  echo "  4. Select this folder: $(pwd)"
  echo ""
  echo "🧪 Test:"
  echo "  1. Go to YouTube and play a video"
  echo "  2. Click extension icon or press Ctrl+Shift+P"
  echo "  3. Video should enter Picture-in-Picture mode"
else
  echo "❌ Missing ${#MISSING_FILES[@]} file(s). Please fix before loading."
fi
