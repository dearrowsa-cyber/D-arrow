$n8nUrl = "https://n8n.d-arrow.com"
$wfId = "seLn9zt0uqLZwJYv"

# Login
$n8nBody = '{"emailOrLdapLoginId":"info@d-arrow.com","password":"D-Arrow.2026"}'
Invoke-RestMethod -Uri "$n8nUrl/rest/login" -Method POST -ContentType "application/json" -Body $n8nBody -SessionVariable session | Out-Null
Write-Host "Logged in" -ForegroundColor Green

# Get workflow to find versionId
$wf = Invoke-RestMethod -Uri "$n8nUrl/rest/workflows/$wfId" -Method GET -WebSession $session
$versionId = $wf.data.versionId
Write-Host "Workflow: $($wf.data.name)" -ForegroundColor Cyan
Write-Host "versionId: $versionId" -ForegroundColor Cyan
Write-Host "Active: $($wf.data.active)" -ForegroundColor Cyan

# Activate with versionId
Write-Host "`nActivating workflow..." -ForegroundColor Yellow
$activateBody = "{`"versionId`":`"$versionId`"}"
try {
    $act = Invoke-RestMethod -Uri "$n8nUrl/rest/workflows/$wfId/activate" -Method POST -ContentType "application/json" -Body $activateBody -WebSession $session
    Write-Host "ACTIVATED!" -ForegroundColor Green
} catch {
    Write-Host "Activation error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    # Try without body
    Write-Host "Trying without body..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$n8nUrl/rest/workflows/$wfId/activate" -Method PATCH -ContentType "application/json" -Body '{"active":true}' -WebSession $session
        Write-Host "Activated via PATCH!" -ForegroundColor Green
    } catch {
        Write-Host "PATCH error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Webhook URL (test):" -ForegroundColor Yellow  
Write-Host "POST https://n8n.d-arrow.com/webhook-test/darrow-ai-content" -ForegroundColor White
Write-Host "Webhook URL (production):" -ForegroundColor Yellow
Write-Host "POST https://n8n.d-arrow.com/webhook/darrow-ai-content" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Yellow
