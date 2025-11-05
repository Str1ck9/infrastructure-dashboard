#!/usr/bin/env bash
# capture_screenshots.sh
# Automated screenshot capture for all dashboard themes
# Requires: Chrome/Chromium installed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCREENSHOTS_DIR="$SCRIPT_DIR/screenshots"
PORT=8088
SERVER_PID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Theme directories and their display names
declare -A THEMES=(
    ["tos"]="Star Trek TOS"
    ["bbs"]="BBS Terminal"
    ["aol"]="AOL Classic"
    ["compuserve"]="CompuServe 1995"
    ["unix"]="UNIX Mainframe"
    ["arcade"]="Arcade (Pac-Man)"
    ["mil2025"]="Military Command 2025"
    ["gopher"]="Gopher Protocol"
    ["win31"]="Windows 3.1"
    ["spaceport"]="Spaceport"
    ["submarine"]="Submarine Command"
    ["aviation"]="Aviation Cockpit"
    ["lcars"]="LCARS Interface"
    ["c64"]="Commodore 64"
    ["aicore"]="AI Command Core"
    ["datacenter"]="Data Center"
    ["dos"]="DOS Shell"
    ["mac7"]="Mac System 7"
    ["mission"]="NASA Mission Control"
    ["cyberdefense"]="Cyber Defense"
    ["neural"]="Neural Network Core"
    ["quantum"]="Quantum Control Room"
    ["biolab"]="BioLab Containment"
    ["chronos"]="Chronos Console"
)

# Function to print colored messages
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to find Chrome executable
find_chrome() {
    local chrome_paths=(
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        "/Applications/Chromium.app/Contents/MacOS/Chromium"
        "/usr/bin/google-chrome"
        "/usr/bin/chromium"
        "/usr/bin/chromium-browser"
        "$(which google-chrome 2>/dev/null || echo '')"
        "$(which chromium 2>/dev/null || echo '')"
    )
    
    for path in "${chrome_paths[@]}"; do
        if [[ -f "$path" && -x "$path" ]]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

# Function to check if port is in use
check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start local web server
start_server() {
    log_info "Checking web server on port $PORT..."
    
    if check_port; then
        log_success "Using existing server on port $PORT"
        return 0
    fi
    
    log_info "Starting local web server on port $PORT..."
    cd "$SCRIPT_DIR"
    python3 -m http.server $PORT > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 2
    
    if check_port; then
        log_success "Server started (PID: $SERVER_PID)"
        return 0
    else
        log_error "Failed to start server"
        return 1
    fi
}

# Function to stop local web server
stop_server() {
    if [[ -n "$SERVER_PID" ]]; then
        log_info "Stopping web server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
        log_success "Server stopped"
    fi
}

# Function to capture screenshot
capture_screenshot() {
    local theme="$1"
    local theme_name="$2"
    local url="http://localhost:$PORT/$theme/index.html"
    local output="$SCREENSHOTS_DIR/${theme}.png"
    
    log_info "Capturing screenshot: $theme_name"
    
    # Use Chrome headless to capture screenshot
    "$CHROME_PATH" --headless --disable-gpu \
        --window-size=1400,1000 \
        --screenshot="$output" \
        --hide-scrollbars \
        "$url" > /dev/null 2>&1
    
    if [[ -f "$output" ]]; then
        local size=$(du -h "$output" | cut -f1)
        log_success "Saved: $theme.png ($size)"
        return 0
    else
        log_error "Failed to capture: $theme_name"
        return 1
    fi
}

# Function to update README.md with screenshots
update_readme() {
    log_info "Updating README.md with screenshots..."
    
    local readme="$SCRIPT_DIR/README.md"
    local backup="$SCRIPT_DIR/README.md.backup"
    
    # Create backup
    cp "$readme" "$backup"
    
    # Create new README with screenshots
    local temp_readme="${readme}.tmp"
    
    # Read existing README and insert screenshots
    awk -v screenshots_dir="screenshots" -v themes="$(declare -p THEMES)" '
    BEGIN {
        # Parse themes array from bash
        in_screenshot_section = 0
    }
    
    # Copy everything until we hit the Themes section
    /^## Themes/ {
        print $0
        print ""
        print "### 📸 Screenshots"
        print ""
        
        # Add screenshot gallery
        themes_array["tos"] = "Star Trek TOS"
        themes_array["bbs"] = "BBS Terminal"
        themes_array["aol"] = "AOL Classic"
        themes_array["compuserve"] = "CompuServe 1995"
        themes_array["unix"] = "UNIX Mainframe"
        themes_array["arcade"] = "Arcade (Pac-Man)"
        themes_array["mil2025"] = "Military Command 2025"
        themes_array["gopher"] = "Gopher Protocol"
        themes_array["win31"] = "Windows 3.1"
        themes_array["spaceport"] = "Spaceport"
        themes_array["submarine"] = "Submarine Command"
        themes_array["aviation"] = "Aviation Cockpit"
        themes_array["lcars"] = "LCARS Interface"
        themes_array["c64"] = "Commodore 64"
        themes_array["aicore"] = "AI Command Core"
        themes_array["datacenter"] = "Data Center"
        themes_array["dos"] = "DOS Shell"
        themes_array["mac7"] = "Mac System 7"
        themes_array["mission"] = "NASA Mission Control"
        themes_array["cyberdefense"] = "Cyber Defense"
        themes_array["neural"] = "Neural Network Core"
        themes_array["quantum"] = "Quantum Control Room"
        themes_array["biolab"] = "BioLab Containment"
        themes_array["chronos"] = "Chronos Console"
        
        theme_order[1] = "tos"
        theme_order[2] = "bbs"
        theme_order[3] = "aol"
        theme_order[4] = "compuserve"
        theme_order[5] = "unix"
        theme_order[6] = "arcade"
        theme_order[7] = "mil2025"
        theme_order[8] = "gopher"
        theme_order[9] = "win31"
        theme_order[10] = "spaceport"
        theme_order[11] = "submarine"
        theme_order[12] = "aviation"
        theme_order[13] = "lcars"
        theme_order[14] = "c64"
        theme_order[15] = "aicore"
        theme_order[16] = "datacenter"
        theme_order[17] = "dos"
        theme_order[18] = "mac7"
        theme_order[19] = "mission"
        theme_order[20] = "cyberdefense"
        theme_order[21] = "neural"
        theme_order[22] = "quantum"
        theme_order[23] = "biolab"
        theme_order[24] = "chronos"
        
        for (i = 1; i <= 24; i++) {
            theme = theme_order[i]
            name = themes_array[theme]
            print "<details>"
            print "<summary><strong>" name "</strong></summary>"
            print ""
            print "![" name "](screenshots/" theme ".png)"
            print ""
            print "</details>"
            print ""
        }
        
        in_screenshot_section = 1
        next
    }
    
    # Skip old screenshot section if it exists
    /^### 📸 Screenshots/ {
        in_screenshot_section = 1
        next
    }
    
    /^###/ && in_screenshot_section {
        in_screenshot_section = 0
    }
    
    !in_screenshot_section {
        print $0
    }
    ' "$readme" > "$temp_readme"
    
    # Replace original with updated version
    mv "$temp_readme" "$readme"
    
    log_success "README.md updated"
    log_info "Backup saved to: README.md.backup"
}

# Main execution
main() {
    echo ""
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║     Dashboard Screenshot Capture & README Updater     ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo ""
    
    # Find Chrome
    log_info "Locating Chrome/Chromium..."
    if ! CHROME_PATH=$(find_chrome); then
        log_error "Chrome or Chromium not found!"
        log_error "Please install Google Chrome or Chromium to continue."
        exit 1
    fi
    log_success "Found: $CHROME_PATH"
    
    # Create screenshots directory
    mkdir -p "$SCREENSHOTS_DIR"
    log_success "Screenshots directory ready: $SCREENSHOTS_DIR"
    
    # Start web server
    if ! start_server; then
        log_error "Failed to start web server"
        exit 1
    fi
    
    # Trap to ensure cleanup
    trap stop_server EXIT
    
    # Wait a moment for server to be fully ready
    sleep 1
    
    # Capture screenshots for each theme
    echo ""
    log_info "Capturing screenshots..."
    echo ""
    
    local captured=0
    local failed=0
    
    for theme in "${!THEMES[@]}"; do
        if [[ -d "$SCRIPT_DIR/$theme" ]]; then
            if capture_screenshot "$theme" "${THEMES[$theme]}"; then
                ((captured++))
            else
                ((failed++))
            fi
            # Small delay between captures
            sleep 0.5
        else
            log_warning "Skipping $theme (directory not found)"
        fi
    done
    
    echo ""
    log_info "Screenshot capture complete!"
    log_success "Captured: $captured"
    if [[ $failed -gt 0 ]]; then
        log_warning "Failed: $failed"
    fi
    
    # Update README
    echo ""
    update_readme
    
    # Summary
    echo ""
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║                    ✨ Complete! ✨                     ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo ""
    log_success "Screenshots saved to: $SCREENSHOTS_DIR/"
    log_success "README.md updated with screenshot gallery"
    echo ""
}

# Run main function
main "$@"
