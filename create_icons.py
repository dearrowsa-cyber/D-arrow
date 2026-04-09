
# WhatsApp gradient outline icon
whatsapp_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="wg" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFB300"/>
      <stop offset="50%" stop-color="#FF6B35"/>
      <stop offset="100%" stop-color="#FF0080"/>
    </linearGradient>
  </defs>
  <!-- Outer speech bubble circle -->
  <path d="M50 10 C27.9 10 10 27.9 10 50 C10 57.5 12.1 64.5 15.8 70.5 L10.5 89.5 L30 84.5 C35.7 87.8 42.6 89.7 50 89.7 C72.1 89.7 90 71.8 90 49.7 C90 27.6 72.1 10 50 10 Z" stroke="url(#wg)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Phone handset inside -->
  <path d="M35 37 C35 37 36.5 33 39.5 33.5 L44 34.5 L46.5 42 L43 44.5 C43 44.5 44.5 49.5 48 53 C51.5 56.5 56.5 58 56.5 58 L59 54.5 L66.5 57 L67.5 61.5 C68 64.5 64 66 64 66 C55 68 35 52 35 37 Z" stroke="url(#wg)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>'''

# TikTok gradient outline icon
tiktok_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="tg" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFB300"/>
      <stop offset="50%" stop-color="#FF6B35"/>
      <stop offset="100%" stop-color="#FF0080"/>
    </linearGradient>
  </defs>
  <!-- TikTok note shape -->
  <path d="M55 12 L55 62 C55 69.7 48.7 76 41 76 C33.3 76 27 69.7 27 62 C27 54.3 33.3 48 41 48 C43.5 48 45.9 48.7 47.9 49.9" stroke="url(#tg)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Top right curve and horizontal bar -->
  <path d="M55 12 C55 12 62 14 68 22 C71.5 27 72 33 72 33" stroke="url(#tg)" stroke-width="5" stroke-linecap="round"/>
  <path d="M55 30 L72 33" stroke="url(#tg)" stroke-width="5" stroke-linecap="round"/>
</svg>'''

with open('public/icon-tiktok-new.svg', 'w', encoding='utf-8') as f:
    f.write(tiktok_svg)
print('TikTok SVG saved!')

with open('public/icon-whatsapp-new.svg', 'w', encoding='utf-8') as f:
    f.write(whatsapp_svg)
print('WhatsApp SVG saved!')
