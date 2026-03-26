Performance improvements applied and next steps

What I changed now:
- Removed client-side logo background processing in `components/Header.tsx` and `components/Footer.tsx`.
- Replaced processed `<img>` with Next.js `Image` for the logo to avoid heavy canvas work.
- Shortened the loading screen delay in `components/ClientLayout.tsx` from 4s to 0.8s.
- Added `.gitignore` rules to avoid committing large video files under `public/`.
- Added an `analyze` script and dev deps (`@next/bundle-analyzer`, `cross-env`) to help measure bundle sizes.

Recommended next actions (run locally):

1. Remove or move heavy video files from repo
- Move `public/main-video.mp4` (and other large media) to an external storage/CDN (Cloudflare, S3, Vimeo, YouTube) and update references to the external URL.
- To remove historical large files from Git history, use `git rm --cached public/main-video.mp4` then commit; for full removal use `git filter-repo` or BFG (careful).

2. Install new dev dependencies and run bundle analyzer

```bash
cd main
npm install
npm run analyze
```

3. Replace other large static images with optimized formats
- Convert large JPGs/PNGs to WebP/AVIF or provide multiple sizes. Use `sharp` in a build step or optimize locally.

4. Lazily load heavy components
- For components like `ImageMarquee`, `LogoMarquee`, and `Portfolio`, replace static imports with dynamic imports (Next.js `dynamic(() => import(...), { ssr: false })`) on pages where they are non-critical.

5. Cache processed assets
- If you need a transparent logo, pre-process it once (locally or in CI) and commit the optimized transparent PNG rather than processing in the browser.

If you want, I can:
- Replace other heavy components with dynamic imports now.
- Move `main-video.mp4` to a new `public/media/` folder and add a note how to host externally.
- Run the analyzer and paste the report here (requires `npm install` and `npm run analyze`).

Which next step should I take?