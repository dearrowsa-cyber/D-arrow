$n8nUrl = "https://n8n.d-arrow.com"

# Login
$n8nBody = '{"emailOrLdapLoginId":"info@d-arrow.com","password":"D-Arrow.2026"}'
$n8nLogin = Invoke-RestMethod -Uri "$n8nUrl/rest/login" -Method POST -ContentType "application/json" -Body $n8nBody -SessionVariable session
Write-Host "Logged in: $($n8nLogin.data.email)" -ForegroundColor Green

# Get Ollama credential ID
$creds = Invoke-RestMethod -Uri "$n8nUrl/rest/credentials" -Method GET -WebSession $session
$ollamaCred = $creds.data | Where-Object { $_.name -eq "Ollama Local" }
$credId = $ollamaCred.id
Write-Host "Credential ID: $credId" -ForegroundColor Cyan

# Read workflow JSON and inject credential ID
$wfPath = Join-Path $PSScriptRoot "workflow.json"
$wfJson = Get-Content -Path $wfPath -Raw -Encoding UTF8

# Inject credential into Ollama node
$wfObj = $wfJson | ConvertFrom-Json
$ollamaNode = $wfObj.nodes | Where-Object { $_.name -eq "Qwen3 8B Model" }
$ollamaNode | Add-Member -MemberType NoteProperty -Name "credentials" -Value @{
    ollamaApi = @{ id = $credId; name = "Ollama Local" }
} -Force

$finalJson = $wfObj | ConvertTo-Json -Depth 20

# Create workflow
Write-Host "`nCreating workflow..." -ForegroundColor Cyan
try {
    $result = Invoke-RestMethod -Uri "$n8nUrl/rest/workflows" -Method POST -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($finalJson)) -WebSession $session
    $wfId = $result.data.id
    Write-Host "Workflow created! ID: $wfId" -ForegroundColor Green
    Write-Host "Name: $($result.data.name)" -ForegroundColor Green

    # Activate
    Write-Host "`nActivating..." -ForegroundColor Cyan
    Invoke-RestMethod -Uri "$n8nUrl/rest/workflows/$wfId/activate" -Method POST -WebSession $session | Out-Null
    Write-Host "Workflow is now ACTIVE!" -ForegroundColor Green

    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "Webhook URL:" -ForegroundColor Yellow
    Write-Host "  POST https://n8n.d-arrow.com/webhook/darrow-ai-content" -ForegroundColor White
    Write-Host "Body: {prompt: 'your prompt here'}" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Yellow
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
}
