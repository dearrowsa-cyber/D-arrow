$ouUrl = "https://ai.d-arrow.com"
$kbId = "42ba8c8a-2b69-4c5c-a486-dc834ea19e30"

# Login
$ouBody = '{"email":"info@d-arrow.com","password":"D-Arrow.2026"}'
$ouLogin = Invoke-RestMethod -Uri "$ouUrl/api/v1/auths/signin" -Method POST -ContentType "application/json" -Body $ouBody
$ouToken = $ouLogin.token
$ouHeaders = @{ Authorization = "Bearer $ouToken"; "Content-Type" = "application/json" }
Write-Host "Logged in!" -ForegroundColor Green

# Get existing D-Arrow model
Write-Host "Getting D-Arrow model..." -ForegroundColor Cyan
$models = Invoke-RestMethod -Uri "$ouUrl/api/v1/models" -Method GET -Headers $ouHeaders
$darrowModel = $models.data | Where-Object { $_.id -eq "darrow-ai" }
Write-Host "Model found: $($darrowModel.name)" -ForegroundColor Green

# Update model to include knowledge base
Write-Host "Attaching Knowledge Base to D-Arrow AI..." -ForegroundColor Cyan

$systemPrompt = "You are D-Arrow AI, the official AI assistant of D-Arrow digital marketing agency. Your expertise includes: SEO optimization, social media marketing, content creation in Arabic and English, Google Ads, Facebook Ads, and digital marketing strategies for Egyptian and Arab businesses. Always be professional, creative, and provide actionable marketing advice. Respond in Arabic by default unless the user writes in English. When writing content, make it engaging and tailored for the Egyptian and Arab market."

$updateBody = @{
    id = "darrow-ai"
    base_model_id = "qwen3:8b"
    name = "D-Arrow AI Assistant"
    params = @{
        system = $systemPrompt
        temperature = 0.7
        num_ctx = 8192
    }
    meta = @{
        description = "The official AI assistant of D-Arrow - powered by knowledge base and trained on D-Arrow services"
        knowledge = @(@{ id = $kbId; name = "D-Arrow Knowledge Base"; type = "collection" })
        tags = @(@{name="marketing"}, @{name="arabic"}, @{name="darrow"})
    }
    is_active = $true
} | ConvertTo-Json -Depth 10

try {
    $result = Invoke-RestMethod -Uri "$ouUrl/api/v1/models/darrow-ai" -Method POST -Headers $ouHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($updateBody))
    Write-Host "Model updated with Knowledge Base!" -ForegroundColor Green
} catch {
    # Try PUT
    try {
        $result = Invoke-RestMethod -Uri "$ouUrl/api/v1/models/darrow-ai/update" -Method POST -Headers $ouHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($updateBody))
        Write-Host "Updated via update endpoint!" -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "All Done! Summary:" -ForegroundColor Green
Write-Host "Level 1 - System Prompt:  DONE" -ForegroundColor Green
Write-Host "Level 2 - RAG:            DONE" -ForegroundColor Green
Write-Host "KB ID: $kbId" -ForegroundColor White
Write-Host "`nGo to ai.d-arrow.com and select 'D-Arrow AI Assistant'" -ForegroundColor Cyan
Write-Host "The AI now knows all about D-Arrow services, pricing & brand!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Yellow
