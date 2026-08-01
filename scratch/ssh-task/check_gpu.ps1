$PortainerUrl = "https://apps.d-arrow.com"
$EnvId = 3
$ContainerId = "2b30dc17c4208b6e86361e83b130327d802c48bc5c0f68197abbe4b1867f1475"

# Login
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$login = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.jwt)" }

# Run nvidia-smi inside ollama container
Write-Host "Checking GPU specs..." -ForegroundColor Cyan
$execBody = '{"AttachStdout":true,"AttachStderr":true,"Tty":false,"Cmd":["nvidia-smi","--query-gpu=name,memory.total,memory.free,utilization.gpu","--format=csv,noheader"]}'
$exec = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$ContainerId/exec" -Method POST -ContentType "application/json" -Headers $headers -Body $execBody
$execId = $exec.Id

# Start with timeout
$startBody = '{"Detach":false}'
try {
    $resp = Invoke-WebRequest -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/exec/$execId/start" -Method POST -ContentType "application/json" -Headers $headers -Body $startBody -TimeoutSec 10
    $output = [System.Text.Encoding]::UTF8.GetString($resp.Content)
    # Strip docker stream header bytes (first 8 bytes of each frame)
    Write-Host "GPU Info: $output" -ForegroundColor Green
} catch {
    Write-Host "Timeout - trying detached..." -ForegroundColor Yellow
    $exec2Body = '{"AttachStdout":false,"AttachStderr":false,"Tty":false,"Cmd":["sh","-c","nvidia-smi > /tmp/gpu.txt 2>&1"]}'
    $exec2 = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$ContainerId/exec" -Method POST -ContentType "application/json" -Headers $headers -Body $exec2Body
    Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/exec/$($exec2.Id)/start" -Method POST -ContentType "application/json" -Headers $headers -Body '{"Detach":true}' -ErrorAction SilentlyContinue
    Write-Host "Check /tmp/gpu.txt inside container" -ForegroundColor Yellow
}

# Also check via Portainer host info
Write-Host "`nChecking host GPU via Docker info..." -ForegroundColor Cyan
$info = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/info" -Method GET -Headers $headers
Write-Host "Docker Runtimes: $($info.Runtimes | ConvertTo-Json)" -ForegroundColor Cyan
if ($info.DefaultRuntime) { Write-Host "Default Runtime: $($info.DefaultRuntime)" }
