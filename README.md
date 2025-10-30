# Infrastructure Dashboard

A retro-styled multi-theme dashboard for monitoring and accessing infrastructure services on your local network.

## Features

- **Multiple Themes**: Star Trek TOS, BBS/Terminal, AOL 3.0, and Classic
- **Real-time Status Monitoring**: Async ping checks with visual indicators
- **Quick Look Modals**: Preview services without leaving the dashboard
- **Keyboard Navigation**: Full keyboard control (especially in BBS theme)
- **Modem Speed Simulation**: Authentic BBS experience with configurable connection speeds
- **Responsive Design**: Works on desktop and mobile devices

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

### BBS Theme Keyboard Shortcuts
- **Arrow Keys**: Navigate menu
- **Enter**: Quick Look (modal preview)
- **Space**: Open in new window
- **/** : Search systems
- **R**: Refresh/reload page
- **M**: Modem speed selector
- **Q**: Quit/disconnect

### Star Trek Theme
- **Click** service cards to open
- **Quick View** button for modal preview
- **Red Alert** button toggles alert mode
- Search bar filters services in real-time

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
└── aol/                   # AOL 3.0 theme
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
