$ouUrl = "https://ai.d-arrow.com"

# Login to Open WebUI
Write-Host "Logging into Open WebUI..." -ForegroundColor Cyan
$ouBody = '{"email":"info@d-arrow.com","password":"D-Arrow.2026"}'
$ouLogin = Invoke-RestMethod -Uri "$ouUrl/api/v1/auths/signin" -Method POST -ContentType "application/json" -Body $ouBody
$ouToken = $ouLogin.token
$ouHeaders = @{ Authorization = "Bearer $ouToken"; "Content-Type" = "application/json" }
Write-Host "Logged in!" -ForegroundColor Green

# Create custom model in Open WebUI with D-Arrow system prompt
Write-Host "`nCreating D-Arrow AI custom model..." -ForegroundColor Cyan

$systemPrompt = "You are D-Arrow AI, the official AI assistant of D-Arrow digital marketing agency in Egypt. Your expertise includes: SEO optimization, social media marketing, content creation in Arabic and English, Google Ads, Facebook Ads, and digital marketing strategies for Egyptian and Arab businesses. Always be professional, creative, and provide actionable marketing advice. Respond in Arabic by default unless the user writes in English. When writing content, make it engaging and tailored for the Egyptian and Arab market."

$modelConfig = @{
    id = "darrow-ai"
    base_model_id = "qwen3:8b"
    name = "D-Arrow AI Assistant"
    params = @{
        system = $systemPrompt
        temperature = 0.7
        num_ctx = 8192
        top_p = 0.9
    }
    meta = @{
        description = "The official AI assistant of D-Arrow digital marketing agency - specialized in Arabic content and Egyptian market"
        tags = @(@{name="marketing"}, @{name="arabic"}, @{name="darrow"})
        profile_image_url = "/static/favicon.png"
    }
    is_active = $true
} | ConvertTo-Json -Depth 10

try {
    $result = Invoke-RestMethod -Uri "$ouUrl/api/v1/models/create" -Method POST -Headers $ouHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($modelConfig))
    Write-Host "Model created: $($result.id)" -ForegroundColor Green
    Write-Host "Name: $($result.name)" -ForegroundColor Green
} catch {
    # Try alternate endpoint
    Write-Host "Trying alternate endpoint..." -ForegroundColor Yellow
    try {
        $result = Invoke-RestMethod -Uri "$ouUrl/api/v1/models" -Method POST -Headers $ouHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($modelConfig))
        Write-Host "Created via /api/v1/models: $($result.id)" -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
        
        # List available API endpoints
        Write-Host "`nChecking available model API..." -ForegroundColor Yellow
        $existing = Invoke-RestMethod -Uri "$ouUrl/api/v1/models" -Method GET -Headers $ouHeaders
        Write-Host "Existing models count: $($existing.data.Count)"
        $existing.data | Select-Object id, name | Format-Table
    }
}
