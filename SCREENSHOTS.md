# Screenshot Automation Guide

## Overview
Automated screenshot capture and README.md update system for all dashboard themes.

## Requirements
- **Google Chrome** or **Chromium** browser installed
- **Python 3** (for local web server)
- **Bash** shell (macOS/Linux)

## Usage

### Quick Start
```bash
./capture_screenshots.sh
```

That's it! The script will:
1. ✅ Find Chrome/Chromium automatically
2. ✅ Start a local web server on port 8088
3. ✅ Capture screenshots of all 24 dashboard themes
4. ✅ Save images to `screenshots/` directory
5. ✅ Update README.md with collapsible screenshot gallery
6. ✅ Stop the web server and clean up

### What It Does

#### Screenshot Capture
- Uses Chrome headless mode to capture each dashboard theme
- Screenshots are 1400x1000 pixels
- Saved as PNG files in `screenshots/` directory
- Filenames match theme directory names (e.g., `tos.png`, `aol.png`)

#### README.md Updates
- Creates backup: `README.md.backup`
- Inserts a **Screenshots** section after "## Themes" heading
- Uses collapsible `<details>` tags for clean organization
- Each screenshot is clickable to expand/collapse

### Output Example
```
╔═══════════════════════════════════════════════════════╗
║     Dashboard Screenshot Capture & README Updater     ║
╚═══════════════════════════════════════════════════════╝

ℹ Locating Chrome/Chromium...
✓ Found: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
✓ Screenshots directory ready: /Users/james/dashboard/screenshots
ℹ Starting local web server on port 8088...
✓ Server started (PID: 12345)

ℹ Capturing screenshots...

ℹ Capturing screenshot: Star Trek TOS
✓ Saved: tos.png (234K)
ℹ Capturing screenshot: BBS Terminal
✓ Saved: bbs.png (189K)
...

ℹ Screenshot capture complete!
✓ Captured: 24

ℹ Updating README.md with screenshots...
✓ README.md updated
ℹ Backup saved to: README.md.backup

╔═══════════════════════════════════════════════════════╗
║                    ✨ Complete! ✨                     ║
╚═══════════════════════════════════════════════════════╝

✓ Screenshots saved to: /Users/james/dashboard/screenshots/
✓ README.md updated with screenshot gallery
```

## Themes Captured

The script automatically captures screenshots for all 24 themes:
1. Star Trek TOS
2. BBS Terminal
3. AOL Classic
4. CompuServe 1995
5. UNIX Mainframe
6. Arcade (Pac-Man)
7. Military Command 2025
8. Gopher Protocol
9. Windows 3.1
10. Spaceport
11. Submarine Command
12. Aviation Cockpit
13. LCARS Interface
14. Commodore 64
15. AI Command Core
16. Data Center
17. TrueNAS Ops Console
18. DOS Shell
19. Mac System 7
20. NASA Mission Control
21. Cyber Defense
22. Neural Network Core
23. Quantum Control Room
24. BioLab Containment
25. Chronos Console

## Troubleshooting

### Chrome Not Found
**Error**: `Chrome or Chromium not found!`

**Solutions**:
1. Install Google Chrome: https://www.google.com/chrome/
2. Or install Chromium: `brew install chromium` (macOS)
3. Make sure Chrome is in standard location:
   - macOS: `/Applications/Google Chrome.app/`
   - Linux: `/usr/bin/google-chrome` or `/usr/bin/chromium`

### Port Already in Use
**Warning**: `Port 8088 is already in use. Using existing server.`

**Action**: The script will use the existing server. No action needed.

If you want to use a different port, edit the script:
```bash
PORT=8088  # Change this to another port like 8089
```

### Server Won't Start
**Error**: `Failed to start server`

**Solutions**:
1. Check if port 8088 is blocked: `lsof -i :8088`
2. Kill any existing process: `kill $(lsof -t -i:8088)`
3. Try a different port in the script

### Screenshot Failed
**Error**: `Failed to capture: [Theme Name]`

**Possible causes**:
1. Theme directory doesn't exist
2. Chrome crashed during capture
3. Server not responding

**Solutions**:
1. Verify theme directory exists: `ls -d [theme]/`
2. Run the script again (it's idempotent)
3. Capture individual theme manually:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --headless --screenshot=test.png \
     http://localhost:8088/[theme]/index.html
   ```

## Manual Screenshot Capture

If you want to capture just one theme manually:

```bash
# Start server
python3 -m http.server 8088 &

# Capture screenshot
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu \
  --window-size=1400,1000 \
  --screenshot=screenshots/mytheme.png \
  --hide-scrollbars \
  http://localhost:8088/mytheme/index.html

# Stop server
killall python3
```

## Customization

### Change Screenshot Size
Edit the `--window-size` parameter in the script:
```bash
--window-size=1920,1080 \  # Larger size
--window-size=1024,768 \   # Smaller size
```

### Change Image Format
Chrome supports:
- PNG (default, best quality)
- JPEG (add `--screenshot` with `.jpg` extension)

### Add New Theme
The script automatically discovers themes from the `THEMES` associative array. To add a new theme:

1. Add to the array in the script:
```bash
declare -A THEMES=(
    ...
    ["newtheme"]="New Theme Name"
)
```

2. Add to the `update_readme()` function's awk section

3. Run the script again

## Files Created

```
dashboard/
├── screenshots/           # Screenshot images
│   ├── tos.png
│   ├── bbs.png
│   ├── aol.png
│   ├── compuserve.png
│   └── ...
├── README.md             # Updated with screenshots
├── README.md.backup      # Original backup
└── capture_screenshots.sh # This script
```

## Git Integration

### Add Screenshots to Git
```bash
git add screenshots/
git add README.md
git commit -m "Add dashboard screenshots"
git push
```

### Gitignore (Optional)
If you don't want to track screenshots in git:
```bash
echo "screenshots/" >> .gitignore
echo "README.md.backup" >> .gitignore
```

### Update Screenshots
When you update a theme and want new screenshots:
```bash
# Delete old screenshots (optional)
rm -rf screenshots/

# Recapture all
./capture_screenshots.sh

# Commit updates
git add screenshots/ README.md
git commit -m "Update dashboard screenshots"
git push
```

## Tips

1. **Run periodically**: Update screenshots when themes change
2. **Check file sizes**: Large PNG files can be optimized with `pngcrush` or `optipng`
3. **Test locally first**: Preview README.md changes before committing
4. **Backup important**: The script creates `README.md.backup` automatically
5. **Chrome timing**: Some themes have animations - consider adding delay if needed

## Advanced Usage

### Capture with Delay (for animations)
Modify the `capture_screenshot` function to add a delay:
```bash
"$CHROME_PATH" --headless --disable-gpu \
    --window-size=1400,1000 \
    --screenshot="$output" \
    --hide-scrollbars \
    --virtual-time-budget=3000 \  # Wait 3 seconds
    "$url" > /dev/null 2>&1
```

### Custom Screenshot Location
Change the `SCREENSHOTS_DIR` variable:
```bash
SCREENSHOTS_DIR="$HOME/Pictures/dashboard_screenshots"
```

### Batch Process Multiple Projects
Create a wrapper script:
```bash
#!/bin/bash
cd /path/to/project1 && ./capture_screenshots.sh
cd /path/to/project2 && ./capture_screenshots.sh
```

---

**Created**: November 5, 2025  
**Author**: Automated Documentation System  
**Version**: 1.0
