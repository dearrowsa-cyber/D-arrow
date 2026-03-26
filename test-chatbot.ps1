# D-Arrow Chatbot API Test Script for Windows PowerShell
# Usage: .\test-chatbot.ps1

Write-Host "🚀 D-Arrow Chatbot API Testing Tool" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# API endpoint
$API_URL = "https://www.d-arrow.com//api/chat"

# Test questions
$TEST_QUESTIONS = @(
    "Hello! What services do you offer?",
    "Tell me about your pricing plans",
    "Can you handle both SEO and web design?",
    "What results can D-Arrow achieve for my business?",
    "How does your process work?"
)

# Check if server is running
Write-Host "Checking if server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $API_URL -Method Get -ErrorAction Stop
    Write-Host "✅ Server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not running on $API_URL" -ForegroundColor Red
    Write-Host "Please start the development server with: npm run dev" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test each question
for ($i = 0; $i -lt $TEST_QUESTIONS.Count; $i++) {
    $QUESTION = $TEST_QUESTIONS[$i]
    Write-Host "Test $($i+1): $QUESTION" -ForegroundColor Yellow
    
    try {
        # Make API call
        $body = @{
            messages = @(
                @{
                    role = "user"
                    content = $QUESTION
                }
            )
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri $API_URL `
            -Method Post `
            -Headers @{"Content-Type" = "application/json"} `
            -Body $body -ErrorAction Stop
        
        $jsonResponse = $response.Content | ConvertFrom-Json
        
        if ($jsonResponse.content) {
            Write-Host "✅ Response received:" -ForegroundColor Green
            Write-Host "   $($jsonResponse.content)" -ForegroundColor Cyan
            Write-Host ""
        } else {
            Write-Host "❌ No valid response" -ForegroundColor Red
            Write-Host "   Raw response: $($response.Content)" -ForegroundColor Red
            Write-Host ""
        }
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
    
    # Small delay between requests
    Start-Sleep -Seconds 1
}

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Testing complete!" -ForegroundColor Green
