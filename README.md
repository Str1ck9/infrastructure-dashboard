# Infrastructure Dashboard

A retro-styled multi-theme dashboard for monitoring and accessing infrastructure services on your local network.

## Features

- **13 Unique Themes**: Star Trek TOS, BBS/Terminal, AOL 3.0, Windows 3.1, Gopher Protocol, UNIX Mainframe, Arcade (Pac-Man), Military Command 2025, Spaceport, Submarine Command, Aviation Cockpit, LCARS Interface, and Commodore 64
- **Real-time Status Monitoring**: Async ping checks with visual indicators
- **Quick Look Modals**: Preview services without leaving the dashboard
- **Keyboard Navigation**: Full keyboard control across all themes
- **Interactive Elements**: Modem speed simulation, arcade gameplay, animated radar, telemetry gauges, Program Manager groups, holographic displays, starfield animations, sonar ping, periscope view, pressure gauges
- **Responsive Design**: Works on desktop and mobile devices
- **Retro & Futuristic Aesthetics**: Authentic period-accurate designs from 1960s to far-future 2425

## Themes

### 🖖 Star Trek TOS Theme (`/tos`)
- Authentic LCARS-inspired interface
- Red Alert mode toggle
- Stardate display
- Console-style service panels

### 📟 BBS Theme (`/bbs`)
- Classic bulletin board system aesthetic
- ANSI-style graphics with scanlines and CRT effects
- Keyboard-driven menu navigation
- Modem speed simulator (300 baud to LAN speeds)
- Progressive page rendering

### 💾 AOL 3.0 Theme (`/aol`)
- Nostalgic 1990s AOL interface
- Desktop-style window chrome
- Toolbar with functional buttons
- "You've Got Mail!" notifications

### 🪟 Windows 3.1 Theme (`/win31`)
- Authentic Windows 3.1 Program Manager interface
- Group windows with service icons
- Classic gray window chrome and menu bars
- Dialog boxes with service properties
- Hourglass loading cursor
- Status bar with online counts and time display
- Desktop icons and draggable windows

### 🐹 Gopher Protocol Theme (`/gopher`)
- 1990s text-based Gopher client aesthetic
- CRT monitor effects with amber phosphor glow
- Numbered menu navigation (type number + ENTER)
- ASCII art header and borders
- Keyboard-driven interface with command prompt
- Service status indicators using Gopher item types
- Help overlay with protocol information
- Commands: Q (quit), R (refresh), ? (help)

### 🖥️ UNIX Mainframe Theme (`/unix`)
- 1990s terminal monitor aesthetic
- Green phosphor screen with IBM Plex Mono font
- Process table view (PID, USER, STATUS, TIME, COMMAND)
- Real-time system stats (uptime, load averages)
- Keyboard shortcuts: R (refresh), S (sort), / (search), Q (quit)

### 🕹️ Arcade Theme (`/arcade`)
- 1980s Pac-Man inspired design
- Press Start 2P pixel font with neon colors
- Gameplay mechanics: eat services for points, power pellets for 2X multiplier
- High score tracking with localStorage
- Level progression system
- CRT scanlines and screen effects
- Controls: Arrow keys, Space (open + eat), V (quick view), R (refresh)

### 🛡️ Military Command 2025 Theme (`/mil2025`)
- Futuristic military operations bunker
- Animated radar sweep with contact blips (60 FPS canvas)
- Live telemetry gauges (CPU, MEM, NET)
- Scrolling alert tape with system status
- Red Alert mode (press R) - intensifies animations and switches to red palette
- DEFCON indicator lamps
- Keyboard shortcuts: F (fullscreen), R (red alert), / (search), ? (help)
- UTC/Local clock display
- Event log with timestamps

### 🚀 Spaceport Theme (`/spaceport`)
- Far-future orbital station control interface (year 2425)
- Animated starfield background with twinkling stars
- Holographic network topology visualization with dynamic nodes
- Glassmorphism UI with cyan/purple neon accents
- Orbitron & Exo 2 futuristic fonts
- Docking bay status display (occupied/vacant)
- Galactic Standard Time (GST) clock
- Real-time activity log feed
- System status meters (Power, Bandwidth, Integrity)
- Glowing service cards with hover animations
- Keyboard shortcuts: F1 (help), F5 (refresh), / (search), ESC (close)

### ⚓ Submarine Command Theme (`/submarine`)
- Cold War era submarine control room (USS ATLAS SSN-775)
- Animated sonar display with rotating sweep and contact detection
- Periscope view with underwater animation and light rays
- Services displayed as torpedo tubes (LOADED/EMPTY status)
- Brass and copper vintage submarine aesthetics
- Pressure gauges for hull integrity and oxygen levels
- Simulated depth, bearing, and speed instruments
- Captain's log with timestamped entries
- Battle Stations alert mode
- Zulu time (UTC) display
- Keyboard shortcuts: S (sonar ping), P (periscope rotate), R (reload), A (alert mode), / (search), ? (help)

### ✈️ Aviation Cockpit Theme (`/aviation`)
- Flight deck instrument panel aesthetic
- Working toggle switches for engines, hydraulics, APU, lights
- Animated altimeter with needle and digital readout
- Rotating compass with heading display
- Airspeed indicator with color-gradient bar
- Adjustable radio stack (COM1/COM2, NAV1, Transponder)
- Clickable warning light indicators
- Flight timer with HH:MM:SS display
- Real-time service monitoring integrated into cockpit
- Quick Look modal for service preview
- Dark cockpit aesthetic with green/cyan HUD displays

### 🖖 LCARS Interface Theme (`/lcars`)
- Star Trek LCARS 47 command interface (USS Enterprise NCC-1701-D)
- Authentic LCARS color scheme with gradient panels
- Animated bridge console with power distribution bars
- Warp core animation with pulsing segments
- Red Alert mode toggle (changes entire interface to red)
- Real-time service status with color-coded indicators
- Tactical systems display with fluctuating power readings
- Stardate display and system status grid
- Quick Look modal with LCARS styling
- Antonio font for authentic Star Trek feel
- Keyboard shortcuts: Click RED ALERT button, refresh, search

### 💾 Commodore 64 Theme (`/c64`)
- Authentic Commodore 64 BASIC V2 interface
- True 16-color C64 palette (exact hex values)
- Slow character-by-character text rendering (15ms per char)
- BASIC boot sequence with READY prompt
- Program LOAD and RUN simulation
- Blinking cursor that follows text rendering
- CRT scanline effects and screen glow
- Two-column service layout for better fit
- Real-time service status checking with [✓]/[✗] indicators
- Keyboard navigation: Press 1-9, 0 to open services
- R to refresh, ESC to close modal
- Uppercase text (authentic C64 limitation)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Str1ck9/infrastructure-dashboard.git
   ```

2. Edit `common/js/services.js` to configure your services:
   ```javascript
   window.SERVICES = [
     {
       title: "Category Name",
       services: [
         { name: "Service Name", url: "http://ip:port", desc: "Description" }
       ]
     }
   ];
   ```

3. Serve the files with any web server:
   ```bash
   # Python 3
   python3 -m http.server 8080
   
   # Node.js (with npx)
   npx http-server -p 8080
   
   # PHP
   php -S localhost:8080
   ```

4. Open in browser: `http://localhost:8080`

## Usage

### Global Features (All Themes)
- **Service Status**: Real-time online/offline detection
- **Quick Look**: Modal previews without leaving dashboard
- **Search/Filter**: Find services by name
- **Responsive**: Adapts to different screen sizes

### Theme-Specific Controls

**BBS Theme:**
- Arrow Keys: Navigate | Enter: Quick Look | Space: Open | /: Search | R: Refresh | M: Modem speed | Q: Quit

**Star Trek TOS:**
- Red Alert button toggles alert mode | Search bar filters services | Quick View for modal preview

**AOL 3.0:**
- Click icons to open services | Double-click for Quick Look | Menu bar for navigation | Desktop-style interaction

**Windows 3.1:**
- Double-click program icons | Right-click for properties | File menu operations | Desktop icons functional

**Gopher:**
- Type item number + ENTER to select | Arrow keys to navigate | R: Refresh | ?: Help | Q: Quit | ESC: Close overlays

**UNIX Mainframe:**
- R: Refresh processes | S: Sort by status | /: Search | Q: Logout | Arrow Keys: Navigate | Enter: Quick view

**Arcade (Pac-Man):**
- START button begins game | Arrow Keys: Navigate maze | Space: Open + eat | V: Quick view | R: Refresh | Click power pellets for 2X points

**Military 2025:**
- F: Fullscreen | R: Red Alert | /: Focus search | ?: Help overlay | Esc: Close overlays

**Spaceport:**
- F1: Help overlay | F5: Refresh services | /: Focus search | ESC: Close modals | Click service cards to view details

**Submarine:**
- S: Sonar ping | P: Periscope rotate | R: Reload status | A: Battle stations alert | /: Search | ?: Help | Click tubes for details

**Aviation Cockpit:**
- Toggle switches to control systems | Radio buttons to adjust frequencies | Click warning lights to toggle alerts | Click services to open | Right-click for Quick Look | ESC: Close modal

**LCARS Interface:**
- RED ALERT button toggles alert mode | Search bar filters services | Click services to open | Quick Look button on hover | Refresh button in header | Click outside modal to close

**Commodore 64:**
- Press number keys 1-9, 0 to open services | Click service name to open in new window | R: Refresh page | ESC: Close modal | Slow text rendering simulates C64 processor

## Project Structure

```
dashboard/
├── index.html              # Main landing page
├── common/
│   ├── css/
│   │   └── reset.css      # CSS reset
│   └── js/
│       └── services.js    # Shared service configuration
├── tos/                   # Star Trek TOS theme
├── bbs/                   # BBS/Terminal theme
├── aol/                   # AOL 3.0 theme
├── win31/                 # Windows 3.1 theme
│   ├── js/
│   │   └── app.js         # Program Manager logic
│   └── css/
│       └── style.css      # Windows 3.1 styling
├── gopher/                # Gopher Protocol theme
│   ├── js/
│   │   └── app.js         # Gopher client logic
│   └── css/
│       └── style.css      # Terminal styling
├── unix/                  # UNIX Mainframe theme
├── arcade/                # Arcade (Pac-Man) theme
├── mil2025/               # Military Command 2025 theme
│   ├── js/
│   │   ├── radar.js       # Animated radar canvas
│   │   ├── telemetry.js   # System gauges
│   │   ├── shortcuts.js   # Keyboard controls
│   │   └── app.js         # Main application
│   └── css/
│       └── style.css      # Military styling
├── spaceport/             # Spaceport theme
│   ├── js/
│   │   └── app.js         # Starfield, hologram, service logic
│   └── css/
│       └── style.css      # Futuristic glassmorphism styling
├── submarine/             # Submarine Command theme
│   ├── js/
│   │   └── app.js         # Sonar, periscope, torpedo tubes logic
│   └── css/
│       └── style.css      # Submarine control styling
├── aviation/              # Aviation Cockpit theme
│   ├── js/
│   │   └── app.js         # Instruments, radio, switches logic
│   └── css/
│       └── style.css      # Cockpit panel styling
├── lcars/                 # LCARS Interface theme
│   ├── js/
│   │   └── app.js         # Bridge console, power bars, Red Alert
│   └── css/
│       └── style.css      # LCARS colors and gradients
└── c64/                   # Commodore 64 theme
    ├── js/
    │   └── app.js         # Slow text rendering, BASIC simulation
    └── css/
        └── style.css      # C64 16-color palette, CRT effects
```

## Customization

- **Add Services**: Edit `common/js/services.js`
- **Change Colors**: Modify CSS variables in each theme's `style.css`
- **Add Themes**: Create new directory with `index.html`, `css/`, and `js/`

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript required
- CSS Grid and Flexbox support needed

## License

Unlicense - Free for any use

## Credits

Created for home lab infrastructure monitoring with a nostalgic twist.
