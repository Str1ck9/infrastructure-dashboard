#!/usr/bin/env python3
"""
Automated screenshot capture for dashboard themes
Uses Selenium with Chrome for reliable screenshot capture
"""

import os
import sys
import subprocess
import time
from pathlib import Path

# Theme configuration
THEMES = {
    "tos": "Star Trek TOS",
    "bbs": "BBS Terminal",
    "aol": "AOL Classic",
    "compuserve": "CompuServe 1995",
    "unix": "UNIX Mainframe",
    "arcade": "Arcade (Pac-Man)",
    "mil2025": "Military Command 2025",
    "gopher": "Gopher Protocol",
    "win31": "Windows 3.1",
    "spaceport": "Spaceport",
    "submarine": "Submarine Command",
    "aviation": "Aviation Cockpit",
    "lcars": "LCARS Interface",
    "c64": "Commodore 64",
    "aicore": "AI Command Core",
    "datacenter": "Data Center",
    "dos": "DOS Shell",
    "mac7": "Mac System 7",
    "mission": "NASA Mission Control",
    "cyberdefense": "Cyber Defense",
    "neural": "Neural Network Core",
    "quantum": "Quantum Control Room",
    "biolab": "BioLab Containment",
    "chronos": "Chronos Console",
}

PORT = 8088
BASE_DIR = Path(__file__).parent
SCREENSHOTS_DIR = BASE_DIR / "screenshots"
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def log_info(msg):
    print(f"ℹ️  {msg}")


def log_success(msg):
    print(f"✅ {msg}")


def log_error(msg):
    print(f"❌ {msg}")


def capture_screenshot(theme, theme_name):
    """Capture a screenshot using Chrome headless"""
    url = f"http://localhost:{PORT}/{theme}/index.html"
    output = SCREENSHOTS_DIR / f"{theme}.png"
    
    log_info(f"Capturing: {theme_name}")
    
    try:
        # Run Chrome headless
        subprocess.run(
            [
                CHROME_PATH,
                "--headless",
                "--disable-gpu",
                "--window-size=1400,1000",
                f"--screenshot={output}",
                "--hide-scrollbars",
                "--disable-dev-shm-usage",
                "--no-sandbox",
                url
            ],
            capture_output=True,
            timeout=15,
            check=True
        )
        
        if output.exists():
            size = output.stat().st_size / 1024
            log_success(f"Saved: {theme}.png ({size:.0f}K)")
            return True
        else:
            log_error(f"Failed: {theme_name}")
            return False
            
    except subprocess.TimeoutExpired:
        log_error(f"Timeout: {theme_name}")
        return False
    except Exception as e:
        log_error(f"Error capturing {theme_name}: {e}")
        return False


def main():
    print()
    print("=" * 60)
    print("   Dashboard Screenshot Capture")
    print("=" * 60)
    print()
    
    # Create screenshots directory
    SCREENSHOTS_DIR.mkdir(exist_ok=True)
    log_success(f"Screenshots directory: {SCREENSHOTS_DIR}")
    
    # Check Chrome
    if not Path(CHROME_PATH).exists():
        log_error("Chrome not found at expected location")
        sys.exit(1)
    log_success(f"Found Chrome")
    
    # Check server
    try:
        import urllib.request
        urllib.request.urlopen(f"http://localhost:{PORT}", timeout=2)
        log_success(f"Server running on port {PORT}")
    except:
        log_error(f"Server not running on port {PORT}")
        log_info("Please start server with: python3 -m http.server 8088")
        sys.exit(1)
    
    print()
    log_info("Capturing screenshots...")
    print()
    
    # Capture screenshots
    captured = 0
    failed = 0
    
    for theme, theme_name in THEMES.items():
        theme_dir = BASE_DIR / theme
        if theme_dir.is_dir():
            if capture_screenshot(theme, theme_name):
                captured += 1
            else:
                failed += 1
            time.sleep(0.5)  # Small delay between captures
        else:
            log_error(f"Directory not found: {theme}")
    
    # Summary
    print()
    print("=" * 60)
    log_success(f"Captured: {captured} screenshots")
    if failed > 0:
        log_error(f"Failed: {failed} screenshots")
    print("=" * 60)
    print()


if __name__ == "__main__":
    main()
