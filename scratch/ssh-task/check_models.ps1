$PortainerUrl = "https://apps.d-arrow.com"
$EnvId = 3
$ContainerId = "2b30dc17c4208b6e86361e83b130327d802c48bc5c0f68197abbe4b1867f1475"

# Login to Portainer
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$login = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.jwt)" }
Write-Host "Logged in to Portainer" -ForegroundColor Green

# Open WebUI correct auth endpoint
Write-Host "`nLogging into Open WebUI..." -ForegroundColor Cyan
$ouBody = '{"email":"info@d-arrow.com","password":"D-Arrow.2026"}'
$ouLogin = Invoke-RestMethod -Uri "https://ai.d-arrow.com/api/v1/auths/signin" -Method POST -ContentType "application/json" -Body $ouBody
$ouToken = $ouLogin.token
Write-Host "Open WebUI OK!" -ForegroundColor Green

$ouHeaders = @{ Authorization = "Bearer $ouToken" }

# Get models
Write-Host "`nGetting models list..." -ForegroundColor Cyan
$models = Invoke-RestMethod -Uri "https://ai.d-arrow.com/api/models" -Method GET -Headers $ouHeaders

Write-Host "`n=== Available Models ===" -ForegroundColor Yellow
foreach ($m in $models.data) {
    Write-Host "  $($m.id)" -ForegroundColor White
}
Write-Host "`nTotal: $($models.data.Count) models" -ForegroundColor Green

# Also trigger a new pull of qwen3:8b via Portainer exec (in case it didn't download yet)
Write-Host "`nChecking if qwen3:8b exists..." -ForegroundColor Cyan
$hasQwen = $models.data | Where-Object { $_.id -like "*qwen3*" }
if ($hasQwen) {
    Write-Host "qwen3 FOUND: $($hasQwen.id)" -ForegroundColor Green
} else {
    Write-Host "qwen3:8b not yet available - triggering pull again..." -ForegroundColor Yellow
    $execBody = '{"AttachStdout":false,"AttachStderr":false,"Tty":false,"Cmd":["ollama","pull","qwen3:8b"]}'
    $execResp = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$ContainerId/exec" -Method POST -ContentType "application/json" -Headers $headers -Body $execBody
    Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/exec/$($execResp.Id)/start" -Method POST -ContentType "application/json" -Headers $headers -Body '{"Detach":true}' -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "Pull command sent! (~5GB download, check back in 10-20 mins)" -ForegroundColor Yellow
}
