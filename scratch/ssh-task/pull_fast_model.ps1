$PortainerUrl = "https://apps.d-arrow.com"
$EnvId = 3
$ContainerId = "2b30dc17c4208b6e86361e83b130327d802c48bc5c0f68197abbe4b1867f1475"

# Login
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$login = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.jwt)" }

# Pull qwen2.5:3b
Write-Host "Pulling qwen2.5:3b..." -ForegroundColor Cyan
$execBody = '{"AttachStdout":false,"AttachStderr":false,"Tty":false,"Cmd":["ollama","pull","qwen2.5:3b"]}'
$execResp = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$ContainerId/exec" -Method POST -ContentType "application/json" -Headers $headers -Body $execBody
Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/exec/$($execResp.Id)/start" -Method POST -ContentType "application/json" -Headers $headers -Body '{"Detach":true}' -TimeoutSec 5 -ErrorAction SilentlyContinue

Write-Host "Pull started in background." -ForegroundColor Green
