# Infrastructure Dashboard

A retro-styled multi-theme dashboard for monitoring and accessing infrastructure services on your local network.

## Features

- **20 Unique Themes**: Star Trek TOS, BBS/Terminal, AOL 3.0, Windows 3.1, Gopher Protocol, UNIX Mainframe, Arcade (Pac-Man), Military Command 2025, Spaceport, Submarine Command, Aviation Cockpit, LCARS Interface, Commodore 64, AI Command Core, Data Center Rack View, DOS Shell, Mac System 7, NASA Mission Control, Cyber Defense Center, and Neural Network Core
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

### 🏢 Data Center Rack View Theme (`/datacenter`)
- Physical data center walkthrough experience
- Photorealistic server rack rendering with gradients and shadows
- Dynamically generated server units (1U-2U) for each service
- Blinking LED indicators (power, activity, network, error states)
- Animated cooling fans on active servers
- Navigate between racks using arrow keys or navigation buttons
- Real-time PDU voltage graph (208V ±2V fluctuation)
- Environmental monitoring (temperature, humidity, power load)
- Service detail modals with server metrics (power, temperature, uptime)
- Preview modal with embedded iframe
- Web Audio API sound effects (fan hum, relay clicks)
- Rack health percentage indicator
- Footer status bar with system metrics
- Keyboard shortcuts: ← → (navigate racks), Space (details), S (sound toggle), ESC (close)

### 💻 DOS Shell Theme (`/dos`)
- Authentic 1980s IBM PC terminal interface
- Boot sequence with memory check and AUTOEXEC.BAT loading
- MS-DOS command interpreter with DIR, RUN, PING, HELP commands
- 80x25 character grid with CRT scanlines
- Block cursor with blinking animation
- Command history with up/down arrow navigation
- VT323 monospace font for authentic DOS feel
- Color-coded output (green=success, red=error, yellow=warning, cyan=headers)
- Service listing with numbered index for quick access
- Real-time service status checking
- Commands: DIR (list), RUN <num> (open), PING (check status), CLS (clear), VER (version), HELP, EXIT

### 💾 Mac System 7 Theme (`/mac7`)
- Authentic 1992 Macintosh Platinum UI interface
- Classic gray window chrome with beveled borders
- Draggable windows with title bars
- Chicago font (with web font fallback)
- Desktop icons: About Dashboard, Services Folder, Trash
- Menu bar with Apple menu, File, Edit, View, Special, and live clock
- Finder-style Services Folder window with icon grid view
- Service detail dialog with Get Info panel layout
- Balloon Help tooltips (800ms delay, yellow with arrow)
- Real-time service status indicators (green checkmark/red X badges)
- Refresh and View toolbar buttons
- Close buttons on windows with keyboard shortcuts
- Outset/inset button styling on press
- Classic Mac scrollbars with beveled appearance
- Startup chime on page load (if browser allows)
- Keyboard: Cmd/Ctrl+W or ESC to close windows | Double-click services to view details

### 🚀 NASA Mission Control Theme (`/mission`)
- Authentic Houston Flight Control Center interface (1960s-2020s hybrid)
- Mission Elapsed Time (MET) clock with DD:HH:MM:SS format counting from page load
- Real-time animated telemetry graph showing service health over time (20 FPS)
- Flight Director panel with clickable service list (left panel)
- Telemetry panel with Canvas-based graphing (center panel)
- Systems panel with live gauges for Network, Services, and Uptime (right panel)
- GO/NO-GO flight status indicator based on service health threshold
- Communications log with timestamped mission events (T+ format)
- Launch commit modal for service details and launch
- CRT flicker effect and scanline overlay for authentic console feel
- Orbitron font for headers, Roboto Mono for data
- NASA blue (#0B3D91) and red (#FC3D21) official color scheme
- Floating rocket emoji animation
- Service status updates with green (online) and red (offline) indicators
- Keyboard shortcuts: R (manual refresh), ESC (close modal)
- Auto-updating telemetry, gauges, and mission clock

### 🧠 Neural Network Core Theme (`/neural`)
- Blade Runner-inspired AI consciousness interface
- Animated neural synapse network using Canvas API with dynamic node connections
- Floating neural nodes with glow effects and pulsing animations
- Consciousness meter displaying AI awareness level (75-95%)
- Neural uptime counter (HH:MM:SS format)
- Cognitive nodes panel showing service status (ACTIVE/PROCESSING/IDLE)
- Thought stream with AI processing messages auto-updating every 4 seconds
- Synaptic activity log with real-time neural events
- Node detail modal with stimulate/isolate controls
- Stimulate function increases consciousness and triggers visual pulse effects
- Isolate function disables cognitive nodes
- Synthwave color scheme: magenta (#ff00ff) and cyan (#00ffff)
- Orbitron font for headers, Rajdhani for body text
- Keyboard shortcuts: P (toggle pulse animation), S (stimulate all nodes), ESC (close modal)
- Canvas animation running at 60 FPS with dynamic connection rendering
- Radial gradient glow effects on nodes and connections

### 🛡️ Cyber Defense Center Theme (`/cyberdefense`)
- USCYBERCOM / SOC (Security Operations Center) war room interface
- Animated world map with simplified continent outlines (Canvas-based)
- Real-time attack arc visualization showing inbound (red) and outbound (blue) traffic
- Service nodes displayed on map as green (secured) or red (compromised) dots with glow effects
- Parabolic attack trajectories with particle trails
- Threat level meter with LOW/GUARDED/ELEVATED/SEVERE status gradients
- Services monitor panel with SECURED/COMPROMISED status indicators
- Threat intelligence dashboard with attacks blocked, services online, response time, uptime stats
- IDS (Intrusion Detection System) log feed with color-coded severity (green=info, yellow=warning, red=alert, blue=info)
- Auto-scroll and clear log controls
- UTC clock display
- Simulated attack detection with source attribution (China, Russia, North Korea, Tor Network, Unknown)
- Service detail modal with DEPLOY, ISOLATE, and CLOSE action buttons
- Pulsing shield icon animation
- Attack counter incrementing with each detected threat
- Share Tech Mono monospace font, Rajdhani sans-serif for headers
- Cyber color scheme: blue (#00d4ff), red (#ff0044), green (#00ff88)
- Map rendering at 20 FPS with attack generation every 2 seconds
- Keyboard shortcuts: S (manual scan), ESC (close modal)

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

**Data Center Rack View:**
- Arrow Keys: Navigate between racks | Space: Show details of first server in rack | S: Toggle sound effects | Click server to view details | ESC: Close modals | Navigation buttons available

**DOS Shell:**
- Type commands and press ENTER | DIR: List services | RUN <number>: Open service | PING: Check all service status | CLS: Clear screen | HELP: Show commands | EXIT: Return to menu | Up/Down arrows: Command history

**Mac System 7:**
- Click desktop icons to open windows | Drag window title bars to move | Double-click services to view details | Hover for Balloon Help | Refresh button to check status | Cmd/Ctrl+W or ESC: Close windows | Click outside to deselect

**NASA Mission Control:**
- Click service in Flight Director panel to view details | LAUNCH button opens service | R key: Manual refresh | ESC: Close modal | Telemetry auto-updates | Watch MET clock count mission time | GO/NO-GO status changes with service health

**Cyber Defense Center:**
- Click services in monitor to view details | Watch animated attack arcs on world map | S key: Manual security scan | DEPLOY button opens service | ISOLATE: Alert notification | CLEAR: Reset IDS log | AUTO-SCROLL: Toggle log scrolling | Threat level updates automatically | ESC: Close modal

**Neural Network Core:**
- Click cognitive nodes to view details | Watch animated neural synapses and connections | P key: Toggle pulse animation | S key: Stimulate all nodes | STIMULATE button boosts consciousness | ISOLATE: Disable node | Thought stream auto-updates | ESC: Close modal | Consciousness meter fluctuates with neural activity

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
├── c64/                   # Commodore 64 theme
│   ├── js/
│   │   └── app.js         # Slow text rendering, BASIC simulation
│   └── css/
│       └── style.css      # C64 16-color palette, CRT effects
├── datacenter/            # Data Center Rack View theme
│   ├── js/
│   │   └── app.js         # Rack generation, LEDs, voltage graph, sound
│   └── css/
│       └── style.css      # Photorealistic rack styling, LED animations
├── dos/                   # DOS Shell theme
│   ├── js/
│   │   └── app.js         # Boot sequence, command interpreter, service access
│   └── css/
│       └── style.css      # IBM PC VGA styling, CRT effects
├── mac7/                  # Mac System 7 theme
│   ├── js/
│   │   └── app.js         # Draggable windows, Finder, balloon help
│   └── css/
│       └── style.css      # Platinum UI, beveled chrome, Chicago font
├── mission/               # NASA Mission Control theme
│   ├── js/
│   │   └── app.js         # Telemetry canvas, MET clock, comms log
│   └── css/
│       └── style.css      # NASA colors, CRT effects, flight console
├── cyberdefense/          # Cyber Defense Center theme
│   ├── js/
│   │   └── app.js         # World map canvas, attack arcs, IDS log
│   └── css/
│       └── style.css      # Cyber color scheme, SOC war room styling
└── neural/                # Neural Network Core theme
    ├── js/
    │   └── app.js         # Neural synapse canvas, consciousness meter, thought stream
    └── css/
        └── style.css      # Synthwave magenta/cyan, Blade Runner aesthetics
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
