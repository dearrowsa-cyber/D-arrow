# 29LT Bukra Font Files

This directory contains the local 29LT Bukra font files used for the D Arrow branding.

## Required Font Files

Download and place the following 29LT Bukra font files in this directory:

### Font Weights:
1. **29LT-Bukra-Regular.ttf** / **29LT-Bukra-Regular.woff2**
   - Font weight: 400 (Regular)
   - Used for normal text

2. **29LT-Bukra-Bold.ttf** / **29LT-Bukra-Bold.woff2**
   - Font weight: 700 (Bold)
   - Used for emphasized text

3. **29LT-Bukra-Black.ttf** / **29LT-Bukra-Black.woff2**
   - Font weight: 900 (Black/Extra Bold)
   - Used for headings like "دي آرو"

## How to Use

1. Download 29LT Bukra font files from the official source
2. Place the .ttf and/or .woff2 files in this directory
3. The @font-face declarations in `app/globals.css` will automatically reference these files
4. Use the font with `font-bukra` class in your components

## File Format Recommendations

- **WOFF2** (.woff2): Recommended - smaller file size, best browser support
- **TTF** (.ttf): Fallback format for older browsers

You can convert TTF to WOFF2 using tools like:
- https://convertio.co/ttf-woff2/
- https://transfonter.org/
