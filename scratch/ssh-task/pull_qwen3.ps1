$PortainerUrl = "https://apps.d-arrow.com"
$EnvId = 3

# Login
Write-Host "Logging in..." -ForegroundColor Cyan
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$loginResponse = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.jwt
$headers = @{ Authorization = "Bearer $token" }
Write-Host "OK!" -ForegroundColor Green

# Get containers
Write-Host "Getting containers..." -ForegroundColor Cyan
$containers = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/json?all=true" -Method GET -Headers $headers
foreach ($c in $containers) {
    Write-Host "  $($c.Names) | $($c.Image) | $($c.State)"
}

# Find ollama container
$ollamaContainer = $containers | Where-Object { $_.Names -like "*ollama*" } | Select-Object -First 1
if ($ollamaContainer) {
    $containerId = $ollamaContainer.Id
    Write-Host "Found Ollama container: $($containerId.Substring(0,12))" -ForegroundColor Green
    
    # Create exec instance
    Write-Host "Creating exec to pull qwen3:8b..." -ForegroundColor Cyan
    $execBody = '{"AttachStdout":true,"AttachStderr":true,"Cmd":["ollama","pull","qwen3:8b"]}'
    $execCreate = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$containerId/exec" -Method POST -ContentType "application/json" -Headers $headers -Body $execBody
    $execId = $execCreate.Id
    Write-Host "Exec ID: $execId" -ForegroundColor Green
    
    # Start exec
    Write-Host "Starting pull (this will take a while)..." -ForegroundColor Yellow
    $startBody = '{"Detach":true}'
    Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/exec/$execId/start" -Method POST -ContentType "application/json" -Headers $headers -Body $startBody
    Write-Host "Pull command sent! Model is downloading in background." -ForegroundColor Green
    Write-Host "Check Portainer > Containers > ollama > Exec Console for progress" -ForegroundColor Yellow
} else {
    Write-Host "Ollama container not found!" -ForegroundColor Red
    Write-Host "All containers:" -ForegroundColor Yellow
    $containers | ForEach-Object { Write-Host "  $($_.Names) - $($_.State)" }
}
