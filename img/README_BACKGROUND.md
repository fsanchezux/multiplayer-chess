# Background Image for Loading Screen

## Required Image

The loading screen requires a background image named `background_load.jpg` or `background_load.png` in this directory.

### Image Specifications

- **Name**: `background_load.jpg` (or `.png`)
- **Recommended Size**: 1920x1080 pixels (Full HD)
- **Aspect Ratio**: 16:9
- **Format**: JPG or PNG
- **Theme**: Chess board or chess-related imagery

### Current Design

The loading screen has:
1. Background image (this file)
2. Gradient overlay from bottom (#d2fe0b) to top (transparent)
3. CHESSVETICA font character 'e' (King piece) in the center
4. Fill animation from bottom to top

### How to Add

1. Place your background image in this directory (`img/`)
2. Name it `background_load.jpg` or `background_load.png`
3. The CSS will automatically load it

### Fallback

If no background image is found, a dark gradient will be used as fallback.

### Tips

- Use a darker image so the neon green (#d2fe0b) overlay stands out
- Blur the background slightly for better focus on the chess piece
- Ensure good contrast with the chess piece outline
