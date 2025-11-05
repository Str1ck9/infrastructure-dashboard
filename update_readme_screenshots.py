#!/usr/bin/env python3
"""Update README.md with screenshot gallery"""

from pathlib import Path

# Theme configuration (in display order)
THEMES = [
    ("tos", "Star Trek TOS"),
    ("bbs", "BBS Terminal"),
    ("aol", "AOL Classic"),
    ("compuserve", "CompuServe 1995"),
    ("unix", "UNIX Mainframe"),
    ("arcade", "Arcade (Pac-Man)"),
    ("mil2025", "Military Command 2025"),
    ("gopher", "Gopher Protocol"),
    ("win31", "Windows 3.1"),
    ("spaceport", "Spaceport"),
    ("submarine", "Submarine Command"),
    ("aviation", "Aviation Cockpit"),
    ("lcars", "LCARS Interface"),
    ("c64", "Commodore 64"),
    ("aicore", "AI Command Core"),
    ("datacenter", "Data Center"),
    ("dos", "DOS Shell"),
    ("mac7", "Mac System 7"),
    ("mission", "NASA Mission Control"),
    ("cyberdefense", "Cyber Defense"),
    ("neural", "Neural Network Core"),
    ("quantum", "Quantum Control Room"),
    ("biolab", "BioLab Containment"),
    ("chronos", "Chronos Console"),
]

def main():
    readme_path = Path("README.md")
    backup_path = Path("README.md.backup")
    
    # Read current README
    with open(readme_path, 'r') as f:
        content = f.read()
    
    # Create backup
    with open(backup_path, 'w') as f:
        f.write(content)
    print(f"✅ Backup created: {backup_path}")
    
    # Find where to insert screenshots (after "## Themes" line)
    lines = content.split('\n')
    new_lines = []
    inserted = False
    skip_old_screenshots = False
    
    for i, line in enumerate(lines):
        # Found the Themes section
        if line.strip() == "## Themes" and not inserted:
            new_lines.append(line)
            new_lines.append("")
            new_lines.append("### 📸 Screenshots")
            new_lines.append("")
            new_lines.append("Click to expand and view screenshots of each theme:")
            new_lines.append("")
            
            # Add screenshot gallery
            for theme_id, theme_name in THEMES:
                new_lines.append("<details>")
                new_lines.append(f"<summary><strong>{theme_name}</strong></summary>")
                new_lines.append("")
                new_lines.append(f"![{theme_name}](screenshots/{theme_id}.png)")
                new_lines.append("")
                new_lines.append("</details>")
                new_lines.append("")
            
            inserted = True
            skip_old_screenshots = True
            continue
        
        # Skip old screenshot section if it exists
        if skip_old_screenshots and line.startswith("### ") and "📸" not in line:
            skip_old_screenshots = False
        
        if not skip_old_screenshots:
            new_lines.append(line)
    
    # Write updated README
    with open(readme_path, 'w') as f:
        f.write('\n'.join(new_lines))
    
    print(f"✅ README.md updated with {len(THEMES)} screenshots")
    print(f"ℹ️  Original backed up to: README.md.backup")
    print()
    print("Screenshots gallery added successfully! 🎉")

if __name__ == "__main__":
    main()
