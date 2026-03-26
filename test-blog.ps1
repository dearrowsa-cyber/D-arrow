# Blog System Testing Script - PowerShell
# Usage: .\test-blog.ps1

Write-Host "🚀 D-Arrow Blog System - Test Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

$API_URL = "https://www.d-arrow.com/"
$SECRET_KEY = "your_secret_key_here"

Write-Host "Testing Blog API Endpoints..." -ForegroundColor Yellow
Write-Host ""

# Test 1: Check blog initialization status
Write-Host "[1/5] Checking Blog Status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/blog/init" `
        -Method Get `
        -Headers @{"Content-Type" = "application/json"} `
        -ErrorAction Stop
    Write-Host "Response: " -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get existing blog posts
Write-Host "[2/5] Fetching Blog Posts..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/blog/posts" `
        -Method Get `
        -Headers @{"Content-Type" = "application/json"} `
        -ErrorAction Stop
    Write-Host "Response: " -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Check schedule status
Write-Host "[3/5] Checking Schedule Status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/blog/schedule" `
        -Method Get `
        -Headers @{"Content-Type" = "application/json"} `
        -ErrorAction Stop
    Write-Host "Response: " -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Generate a single blog post
Write-Host "[4/5] Generating Single Blog Post..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/blog/generate" `
        -Method Post `
        -Headers @{"Content-Type" = "application/json"} `
        -ErrorAction Stop
    Write-Host "Response: " -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Trigger schedule (auto-post)
Write-Host "[5/5] Triggering Auto-Post Schedule..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/blog/schedule" `
        -Method Post `
        -Headers @{"Content-Type" = "application/json"} `
        -ErrorAction Stop
    Write-Host "Response: " -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Blog System Tests Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Blog Page: https://www.d-arrow.com//blog" -ForegroundColor Cyan
Write-Host "📊 API Status: https://www.d-arrow.com//api/blog/init" -ForegroundColor Cyan
Write-Host "🔧 Check Cron: https://www.d-arrow.com//api/blog/cron" -ForegroundColor Cyan
