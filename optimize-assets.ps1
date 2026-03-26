# Video & Image Optimization Script for D Arrow Digital (PowerShell Version)
# Usage: powershell.exe -ExecutionPolicy Bypass -File optimize-assets.ps1

Write-Host "🎬 Starting Asset Optimization Process..." -ForegroundColor Cyan

# Create optimized directories
$optimizedVideos = "public/optimized/videos"
$optimizedImages = "public/optimized/images"

if (-not (Test-Path $optimizedVideos)) {
    New-Item -ItemType Directory -Path $optimizedVideos -Force | Out-Null
}

if (-not (Test-Path $optimizedImages)) {
    New-Item -ItemType Directory -Path $optimizedImages -Force | Out-Null
}

# =====================================================
# 1. VIDEO OPTIMIZATION
# =====================================================

Write-Host "`n📹 Video Optimization Instructions..." -ForegroundColor Yellow

$ffmpegPath = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Path

if ($ffmpegPath) {
    Write-Host "✅ FFmpeg found at: $ffmpegPath" -ForegroundColor Green
    
    $videoFile = "public/main-video.mp4"
    if (Test-Path $videoFile) {
        Write-Host "Starting video compression (this may take a few minutes)..." -ForegroundColor Cyan
        
        # Compress to MP4
        $args = @(
            "-i", $videoFile,
            "-c:v", "libx264",
            "-preset", "medium",
            "-b:v", "1500k",
            "-b:a", "128k",
            "-c:a", "aac",
            "public/optimized/videos/main-video-compressed.mp4"
        )
        
        & ffmpeg $args
        
        if ($LASTEXITCODE -eq 0) {
            $originalSize = (Get-Item $videoFile).Length / 1MB
            $compressedSize = (Get-Item "public/optimized/videos/main-video-compressed.mp4").Length / 1MB
            
            Write-Host "✅ MP4 compression complete!" -ForegroundColor Green
            Write-Host "   Original: $([Math]::Round($originalSize, 2))MB"
            Write-Host "   Compressed: $([Math]::Round($compressedSize, 2))MB"
            Write-Host "   Savings: $([Math]::Round($originalSize - $compressedSize, 2))MB"
        }
    }
} else {
    Write-Host "❌ FFmpeg not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install FFmpeg:"
    Write-Host "Option 1 - Using Chocolatey: choco install ffmpeg"
    Write-Host "Option 2 - Using Windows Package Manager: winget install FFmpeg.FFmpeg"
    Write-Host "Option 3 - Download from: https://ffmpeg.org/download.html"
}

# =====================================================
# 2. IMAGE OPTIMIZATION
# =====================================================

Write-Host "`n🖼️  Image Optimization Instructions..." -ForegroundColor Yellow

# Count PNG files
$pngFiles = Get-ChildItem "public/icon/*.png" -ErrorAction SilentlyContinue
if ($pngFiles) {
    Write-Host "Found $($pngFiles.Count) PNG files ready for WebP conversion" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To convert PNG to WebP format:"
    Write-Host "1. Install ImageMagick: choco install imagemagick"
    Write-Host "   OR use online converter: https://cloudconvert.com/"
    Write-Host ""
    Write-Host "2. Or use Node.js sharp library:"
    Write-Host "   npm install sharp"
    Write-Host "   npx node scripts/convert-to-webp.js"
}

# =====================================================
# 3. BUNDLE ANALYSIS
# =====================================================

Write-Host "`n📊 Bundle Size Analysis..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" | ConvertFrom-Json

if ($packageJson.scripts.analyze) {
    Write-Host "Running bundle analysis..." -ForegroundColor Cyan
    npm run analyze
} else {
    Write-Host "Bundle analyzer not configured in package.json" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To add bundle analysis:"
    Write-Host "1. npm install --save-dev @next/bundle-analyzer cross-env"
    Write-Host "2. Create next.config.js with analyzer config"
    Write-Host "3. Add script: 'analyze': 'cross-env ANALYZE=true next build'"
}

# =====================================================
# 4. PERFORMANCE REPORT
# =====================================================

Write-Host "`n📋 Asset Sizes Summary:" -ForegroundColor Cyan

$totalSize = 0

if (Test-Path "public/main-video.mp4") {
    $size = (Get-Item "public/main-video.mp4").Length / 1MB
    Write-Host "   main-video.mp4: $([Math]::Round($size, 2))MB"
    $totalSize += $size
}

$iconSize = (Get-ChildItem "public/icon/*.png" -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
if ($iconSize -gt 0) {
    Write-Host "   PNG icons: $([Math]::Round($iconSize, 2))MB"
    $totalSize += $iconSize
}

Write-Host ""
Write-Host "Total optimizable assets: $([Math]::Round($totalSize, 2))MB" -ForegroundColor Yellow

# =====================================================
# 5. NEXT STEPS
# =====================================================

Write-Host "`n✅ Asset Optimization Guide Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Compress video file(s) using FFmpeg"
Write-Host "2. Convert PNG icons to WebP format"  
Write-Host "3. Test build: npm run build"
Write-Host "4. Analyze bundle: npm run analyze"
Write-Host "5. Monitor performance: https://pagespeed.web.dev"
Write-Host ""
Write-Host "💡 Optimization Targets:" -ForegroundColor Cyan
Write-Host "   • Reduce main bundle < 200KB"
Write-Host "   • Video files < 5MB each"
Write-Host "   • Page load time < 3 seconds"
Write-Host "   • Lighthouse score > 90"
