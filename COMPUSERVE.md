# CompuServe 1995 UI Design Guide

## 🎨 Overview
This guide documents how to recreate the authentic CompuServe Information Manager (WinCIM) interface from 1995 for other web projects. The design captures the classic Windows 95 aesthetic with its distinctive teal desktop, gray beveled UI elements, and early internet nostalgia.

---

## 🖼️ Visual Design Elements

### **Color Palette**

#### Primary Colors:
- **Windows 95 Teal**: `#008080` (desktop background)
- **Window Gray**: `#c0c0c0` (main UI background)
- **Title Bar Blue**: `linear-gradient(90deg, #000080 0%, #1084d0 100%)`
- **Navy Blue**: `#000080` (CompuServe branding)
- **White**: `#ffffff` (text, highlights)
- **Black**: `#000000` (text, shadows)

#### Beveled Border Pattern:
```css
/* Classic Windows 95 raised button/panel */
border: 2px solid;
border-color: #ffffff #000000 #000000 #ffffff;
box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;

/* Sunken/inset effect */
border-color: #808080 #ffffff #ffffff #808080;
```

#### Shadow Colors:
- Light gray: `#dfdfdf`, `#e0e0e0`
- Medium gray: `#808080`
- Dark shadow: `rgba(0, 0, 0, 0.4)`

---

## 🪟 Core UI Components

### 1. **Window Structure**

```html
<div class="window">
  <div class="titlebar">
    <div class="titlebar-left">
      <img class="window-icon" src="icon.svg">
      <span class="title-text">Application Name</span>
    </div>
    <div class="controls">
      <button class="btn minimize">_</button>
      <button class="btn maximize">□</button>
      <button class="btn close">×</button>
    </div>
  </div>
  <!-- Menu, toolbar, content, statusbar -->
</div>
```

**CSS:**
```css
.window {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: 
    inset 1px 1px 0 #dfdfdf,
    inset -1px -1px 0 #808080,
    2px 2px 8px rgba(0, 0, 0, 0.4);
}

.titlebar {
  background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
  padding: 2px 4px;
  min-height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-text {
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.btn {
  width: 18px;
  height: 18px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
```

---

### 2. **Menu Bar**

```html
<div class="menubar">
  <button class="menu-item">File</button>
  <button class="menu-item">Edit</button>
  <button class="menu-item">View</button>
  <button class="menu-item">Help</button>
</div>
```

**CSS:**
```css
.menubar {
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 4px;
  display: flex;
}

.menu-item {
  padding: 4px 12px;
  background: transparent;
  border: none;
  font-size: 11px;
  cursor: pointer;
  color: #000;
}

.menu-item:hover {
  background: #000080;
  color: white;
}
```

---

### 3. **Toolbar with Icon Buttons**

```html
<div class="toolbar">
  <button class="toolbar-btn" title="Action">
    <div class="icon icon-custom"></div>
  </button>
</div>
```

**CSS:**
```css
.toolbar {
  background: #c0c0c0;
  border-bottom: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 4px 6px;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  cursor: pointer;
}

.toolbar-btn:hover {
  border-color: #ffffff #000000 #000000 #ffffff;
}

.toolbar-btn:active {
  border-color: #000000 #ffffff #ffffff #000000;
  background: #808080;
}

/* Icon styling - use colored squares with emojis or text */
.icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.icon-custom {
  background: #00ff00; /* Bright colors work well */
}
```

---

### 4. **Content Cards/Panels**

```html
<div class="panel">
  <div class="panel-header">
    <span>Section Title</span>
  </div>
  <div class="panel-content">
    <!-- Content here -->
  </div>
</div>
```

**CSS:**
```css
.panel {
  background: white;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 12px;
  margin: 8px;
}

.panel-header {
  background: linear-gradient(135deg, #4169e1 0%, #1e90ff 100%);
  color: white;
  padding: 8px 12px;
  font-weight: 700;
  border: 2px solid #000080;
}
```

---

### 5. **Status Bar**

```html
<div class="statusbar">
  <div class="status-section status-main">
    <span>Ready</span>
  </div>
  <div class="status-divider"></div>
  <div class="status-section">
    <span id="time">15:29:23</span>
  </div>
</div>
```

**CSS:**
```css
.statusbar {
  display: flex;
  background: #c0c0c0;
  border-top: 1px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  padding: 2px 4px;
  font-size: 11px;
  min-height: 20px;
}

.status-section {
  padding: 2px 8px;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
}

.status-main {
  flex: 1;
}

.status-divider {
  width: 2px;
  background: #808080;
  margin: 0 4px;
}
```

---

### 6. **Dialog Boxes**

```html
<div class="dialog">
  <div class="dialog-titlebar">
    <span class="dialog-title">About</span>
    <button class="dialog-close">×</button>
  </div>
  <div class="dialog-content">
    <div class="dialog-icon">💾</div>
    <div class="dialog-info">
      <strong>Application Name</strong><br>
      Version 1.0<br>
      Copyright © 1995
    </div>
    <button class="ok-btn">OK</button>
  </div>
</div>
```

**CSS:**
```css
.dialog {
  width: 360px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
}

.dialog-titlebar {
  display: flex;
  justify-content: space-between;
  background: #000080;
  padding: 2px 4px;
  min-height: 20px;
}

.dialog-title {
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.ok-btn {
  padding: 4px 16px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.ok-btn:active {
  border-color: #000000 #ffffff #ffffff #000000;
}
```

---

## 🎯 CompuServe-Specific Elements

### **CompuServe Logo**
```html
<div class="cis-logo">
  <div class="logo-icon">@</div>
  <div class="logo-text">CompuServe</div>
</div>
```

**CSS:**
```css
.cis-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
}

.logo-icon {
  font-size: 32px;
  font-weight: 700;
  color: #ff0000;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #000080;
}
```

---

### **Service Cards (Grid Layout)**
```html
<div class="service-grid">
  <div class="service-card">
    <div class="service-status-dot online"></div>
    <div class="service-icon">📁</div>
    <div class="service-name">Service Name</div>
    <div class="service-url">localhost:8080</div>
  </div>
</div>
```

**CSS:**
```css
.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 12px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
}

.service-card {
  background: white;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.service-card:hover {
  background: #e0e0ff;
  border-color: #000080;
}

.service-status-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #000;
}

.service-status-dot.online {
  background: #00ff00;
}

.service-status-dot.offline {
  background: #ff0000;
  animation: blink 0.5s steps(2) infinite;
}

@keyframes blink {
  50% { opacity: 0.3; }
}

.service-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.service-name {
  font-size: 12px;
  font-weight: 700;
  color: #000080;
}

.service-url {
  font-size: 10px;
  color: #666;
  font-family: 'Courier New', monospace;
}
```

---

## 🎨 Typography

### **Fonts:**
```css
body {
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
}

/* Monospace for URLs/code */
.monospace {
  font-family: 'Courier New', monospace;
}
```

### **Font Sizes:**
- Window title: `11px`
- Menu items: `11px`
- Status bar: `11px`
- Dialog text: `11px`
- Service names: `12px`
- Service URLs: `10px`
- Headings: `18-24px`

---

## 📱 Responsive Breakpoints

```css
@media (max-width: 1024px) {
  .service-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  body {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .service-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## ⚡ Interactive Behaviors

### **Button States:**
```css
/* Normal */
.button {
  border-color: #ffffff #000000 #000000 #ffffff;
}

/* Hover */
.button:hover {
  border-color: #ffffff #000000 #000000 #ffffff;
  filter: brightness(1.05);
}

/* Active/Pressed */
.button:active {
  border-color: #000000 #ffffff #ffffff #000000;
  background: #808080;
}
```

### **Status Indicator Animations:**
```css
.checking {
  background: #ffff00;
  animation: blink 1s steps(2) infinite;
}

.loading {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 🛠️ Implementation Checklist

### **Essential Elements:**
- [ ] Windows 95 teal background (`#008080`)
- [ ] Gray beveled window (`#c0c0c0`)
- [ ] Blue gradient title bar with window controls
- [ ] Menu bar with hover states
- [ ] Toolbar with icon buttons
- [ ] Beveled borders (raised/sunken)
- [ ] Status bar at bottom
- [ ] Proper shadow effects
- [ ] 11px system font

### **CompuServe Specific:**
- [ ] @ logo with red/navy colors
- [ ] "Explore CompuServe" banner
- [ ] Service grid with status dots
- [ ] "About WinCIM" dialog
- [ ] Member ID system
- [ ] Blue service card backgrounds

### **Polish:**
- [ ] Button press animations
- [ ] Status indicator blinking
- [ ] Hover effects on cards
- [ ] Dialog box shadows
- [ ] Responsive grid layouts
- [ ] Monospace fonts for technical text

---

## 🎯 Use Cases

This design pattern works great for:

1. **Retro Web Applications**: Dashboard, admin panels, file managers
2. **Nostalgia Projects**: 90s internet experiences, retro games
3. **Tech Portfolios**: Showcase vintage UI/UX skills
4. **Educational Sites**: Teaching web history
5. **Art Projects**: Digital archaeology, web aesthetics
6. **Corporate Dashboards**: Fun alternative to modern flat design

---

## 📚 Additional Resources

### **Inspiration Sources:**
- Windows 95 UI guidelines
- CompuServe Information Manager screenshots
- Early AOL/Prodigy interfaces
- 90s web design archives

### **Modern Implementations:**
- Windows 95 CSS frameworks
- Retro UI libraries
- Pixel art tools
- CRT shader effects

---

## 🎨 Quick Color Reference

```css
:root {
  /* Windows 95 */
  --desktop-teal: #008080;
  --window-gray: #c0c0c0;
  --title-blue-start: #000080;
  --title-blue-end: #1084d0;
  
  /* CompuServe */
  --cis-navy: #000080;
  --cis-red: #ff0000;
  --cis-blue: #4169e1;
  --cis-light-blue: #1e90ff;
  
  /* Borders */
  --border-light: #ffffff;
  --border-dark: #000000;
  --border-medium: #808080;
  --border-highlight: #dfdfdf;
  
  /* Status */
  --status-online: #00ff00;
  --status-offline: #ff0000;
  --status-checking: #ffff00;
}
```

---

## 💡 Pro Tips

1. **Use pixel-perfect measurements**: Windows 95 was designed for specific resolutions
2. **Embrace the gray**: Don't be afraid of the classic `#c0c0c0`
3. **Beveled everything**: That 3D effect is key to authenticity
4. **Small fonts**: 11-12px was standard in 1995
5. **Simple icons**: Use emojis or simple colored shapes
6. **Status indicators**: Blinking LEDs were everywhere
7. **Monospace for tech**: URLs, IPs, code should use Courier New
8. **Box shadows**: Keep them subtle and dark
9. **Desktop background**: Teal or wood grain patterns work great
10. **Test on different screens**: The UI should feel cramped but organized

---

## 🚀 Getting Started Template

```html
<!doctype html>
<html>
<head>
  <title>My CompuServe-style App</title>
  <style>
    body { 
      font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
      background: #008080;
      padding: 20px;
    }
    .window {
      max-width: 1200px;
      margin: 0 auto;
      background: #c0c0c0;
      border: 2px solid;
      border-color: #ffffff #000000 #000000 #ffffff;
      box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
    }
    /* Add more styles... */
  </style>
</head>
<body>
  <div class="window">
    <!-- Your CompuServe-style interface here -->
  </div>
</body>
</html>
```

---

**Created**: November 5, 2025  
**Based on**: CompuServe Information Manager (WinCIM) 2.0.1 (1995)  
**Best viewed**: On any modern browser with a sense of nostalgia! 🖥️✨
