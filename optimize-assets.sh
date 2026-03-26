#!/bin/bash
# Video & Image Optimization Script for D Arrow Digital
# Usage: bash optimize-assets.sh

echo "🎬 Starting Asset Optimization Process..."

# Create optimized directories
mkdir -p public/optimized/videos
mkdir -p public/optimized/images

# =====================================================
# 1. VIDEO OPTIMIZATION
# =====================================================

echo ""
echo "📹 Optimizing Video Files..."

if command -v ffmpeg &> /dev/null; then
    # Compress main-video.mp4
    if [ -f "public/main-video.mp4" ]; then
        echo "Compressing main-video.mp4..."
        
        # Create compressed MP4
        ffmpeg -i public/main-video.mp4 \
            -c:v libx264 \
            -preset medium \
            -b:v 1500k \
            -b:a 128k \
            -c:a aac \
            public/optimized/videos/main-video-compressed.mp4
        
        # Create WebM version (better compression)
        ffmpeg -i public/main-video.mp4 \
            -c:v libvpx-vp9 \
            -b:v 1200k \
            -c:a libopus \
            -b:a 128k \
            public/optimized/videos/main-video.webm
        
        echo "✅ Video compressed!"
        echo "   Original size: $(du -h public/main-video.mp4 | cut -f1)"
        echo "   MP4 compressed: $(du -h public/optimized/videos/main-video-compressed.mp4 | cut -f1)"
        echo "   WebM version: $(du -h public/optimized/videos/main-video.webm | cut -f1)"
    fi
else
    echo "❌ FFmpeg not found. Install with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
fi

# =====================================================
# 2. IMAGE OPTIMIZATION
# =====================================================

echo ""
echo "🖼️  Optimizing Image Files..."

if command -v cwebp &> /dev/null; then
    # Convert PNG icons to WebP
    for file in public/icon/*.png; do
        if [ -f "$file" ]; then
            filename=$(basename "$file" .png)
            echo "Converting $filename to WebP..."
            cwebp "$file" -o "public/optimized/images/$filename.webp" -q 80
        fi
    done
    echo "✅ PNG to WebP conversion complete!"
else
    echo "ℹ️  WebP converter not installed. Install with: brew install webp (macOS)"
fi

# =====================================================
# 3. BUNDLE ANALYSIS
# =====================================================

echo ""
echo "📊 Analyzing Bundle Size..."

if grep -q "analyze" package.json; then
    echo "Running bundle analysis..."
    npm run analyze
else
    echo "ℹ️  Bundle analyzer not configured. Add to package.json:"
    echo '  "analyze": "cross-env ANALYZE=true next build"'
fi

echo ""
echo "✅ Asset optimization complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review optimized files in public/optimized/"
echo "2. Update references in components to use optimized versions"
echo "3. Commit optimized files to repository"
echo "4. Monitor performance improvements with PageSpeed Insights"

