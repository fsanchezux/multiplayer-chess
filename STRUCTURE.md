# Project Structure

This document describes the organization of the Multiplayer Chess application.

## Directory Structure

```
multiplayer-chess/
├── index.html              # Main HTML file (clean structure, no inline scripts)
├── app.js                  # Node.js backend server
├── myModule.js             # File serving utilities
├── package.json            # Project dependencies
├── css/
│   ├── main.css           # Base styles and utilities
│   ├── loading.css        # Loading screen styles
│   ├── modals.css         # Modal dialogs styles
│   └── custom-chess.css   # Chess-specific custom styles
├── js/
│   ├── init.js            # Application initialization
│   ├── theme.js           # Theme management (dark/light mode)
│   ├── ui.js              # UI utilities (toasts, modals, etc.)
│   ├── websocket.js       # WebSocket communication
│   ├── game.js            # Core chess game logic
│   ├── menu.js            # Menu and mode selection
│   ├── threeRules.js      # 3 Rules mode logic
│   ├── chess.js           # Chess.js library
│   └── chessboard-*.js    # Chessboard.js library files
└── img/                   # Chess piece images

```

## File Responsibilities

### HTML
- **index.html**: Clean markup with semantic sections:
  - Loading screen
  - Modal dialogs (main menu, setup screens)
  - Game board and controls
  - Move history panel

### CSS Modules
1. **main.css**:
   - CSS variables for theming
   - Base styles and resets
   - Utility classes
   - Button and label styles
   - Toast notifications

2. **loading.css**:
   - Loading screen overlay
   - Animations (spinner, pulse, fade)
   - Loading screen transitions

3. **modals.css**:
   - Modal overlay and content
   - Modal header, body, footer
   - Form inputs and buttons
   - Color selectors
   - Responsive modal layouts

4. **custom-chess.css**:
   - Chess-specific styling
   - Board customizations
   - Game-specific components

### JavaScript Modules
Load order is important! Scripts load in this sequence:

1. **theme.js** (no dependencies):
   - Theme definitions (light/dark)
   - `applyTheme()` function
   - `toggleTheme()` function
   - `loadThemePreference()` function

2. **ui.js** (depends on: theme.js):
   - Toast notification system
   - Loading screen management
   - Modal show/hide functions
   - Turn indicator updates
   - Move history display
   - Highlight system

3. **websocket.js** (depends on: ui.js):
   - WebSocket connection initialization
   - `sendMove()` function
   - `joinRoom()` function
   - Server message handling
   - Room management

4. **threeRules.js** (depends on: game.js, ui.js):
   - Special move detection
   - 3 Rules mode logic
   - Piece transformation system

5. **game.js** (depends on: ui.js, websocket.js):
   - Chess game initialization
   - Board event handlers (drag, drop, snap)
   - Game state management
   - AI opponent logic
   - Game controls (reset, restart, flip)

6. **menu.js** (depends on: game.js, websocket.js):
   - Game mode selection
   - Single player setup
   - Multiplayer setup
   - Player configuration

7. **init.js** (depends on: ALL above):
   - Application initialization
   - Coordinates all modules
   - Page lifecycle management

## Key Features

### Separation of Concerns
- **HTML**: Structure only, no inline scripts or styles
- **CSS**: Modular, theme-based styling
- **JavaScript**: Separated by functionality

### Loading Sequence
1. Page loads → Loading screen appears
2. Theme loads from localStorage
3. WebSocket connects
4. Chess board initializes
5. Loading screen fades out
6. Main menu modal appears

### Communication Flow
```
User Action → Menu/UI → Game Logic → WebSocket → Server
                ↓           ↓           ↓
              Theme      Board Update  Broadcast
```

## Modifying the Interface

To change the interface without affecting functionality:

### Change Colors/Theme
- Edit: `css/main.css` (CSS variables)
- Edit: `js/theme.js` (theme objects)

### Change Layout
- Edit: `index.html` (structure)
- Edit: `css/main.css`, `css/modals.css` (layout styles)

### Change Loading Screen
- Edit: `index.html` (loading screen section)
- Edit: `css/loading.css`

### Change Modals
- Edit: `index.html` (modal sections)
- Edit: `css/modals.css`

## Adding New Features

### Add New CSS Module
1. Create `css/new-module.css`
2. Add link in `index.html` head section
3. Use CSS variables for theming

### Add New JavaScript Module
1. Create `js/new-module.js`
2. Add script tag in `index.html` (respect load order!)
3. Export functions to global scope or use module pattern

## Best Practices

### When Editing
- ✅ Keep HTML clean (no inline scripts/styles)
- ✅ Use CSS variables for colors
- ✅ Keep JS modules focused on single responsibility
- ✅ Maintain load order for JS files
- ✅ Use semantic HTML5 elements
- ✅ Comment your code sections

### When Testing
- Test in both dark and light themes
- Test all game modes (single player, multiplayer, AI)
- Test responsive layout (mobile, tablet, desktop)
- Test with/without 3 Rules mode
- Check browser console for errors

## Troubleshooting

### Issue: Styles not applying
- Check CSS file is linked in index.html
- Check CSS variables are defined in main.css
- Check browser cache (hard refresh: Ctrl+F5)

### Issue: Functions not defined
- Check script load order
- Check function is defined before use
- Check browser console for errors

### Issue: WebSocket not connecting
- Check server is running (node app.js)
- Check WebSocket URL in websocket.js
- Check firewall/port settings

## Development Workflow

1. Start server: `node app.js`
2. Open browser: `http://localhost:4000/index.html`
3. Make changes to files
4. Refresh browser (Ctrl+F5 for cache clear)
5. Test functionality
6. Commit changes

## Production Deployment

Before deploying:
- [ ] Minify CSS files
- [ ] Minify JavaScript files
- [ ] Optimize images
- [ ] Test all features
- [ ] Update README
- [ ] Set production WebSocket URL
