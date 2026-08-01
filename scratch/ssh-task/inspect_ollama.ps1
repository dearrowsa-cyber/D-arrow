$PortainerUrl = "https://apps.d-arrow.com"
$EnvId = 3
$ContainerId = "2b30dc17c4208b6e86361e83b130327d802c48bc5c0f68197abbe4b1867f1475"

# Login
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$login = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.jwt)" }
Write-Host "Logged in" -ForegroundColor Green

# Use Portainer's Docker proxy to call Ollama's internal API
# Portainer proxies requests to the Docker engine, so we go through /api/endpoints/3/docker
# But Ollama runs inside a container - we need to use its exec API

# Alternative: Check via Docker inspect for mounted volumes or via Portainer's direct API
# Let's check the container details
$inspect = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$ContainerId/json" -Method GET -Headers $headers
Write-Host "Container Status: $($inspect.State.Status)" -ForegroundColor Cyan
Write-Host "Container Health: $($inspect.State.Health.Status)" -ForegroundColor Cyan

# Check port bindings
Write-Host "`nPort Bindings:" -ForegroundColor Yellow
$inspect.HostConfig.PortBindings | ConvertTo-Json -Depth 3

# Check environment variables
Write-Host "`nEnvironment:" -ForegroundColor Yellow
$inspect.Config.Env

# Try to get volumes - where models are stored
Write-Host "`nVolumes:" -ForegroundColor Yellow
$inspect.Mounts | ForEach-Object { Write-Host "  $($_.Type): $($_.Source) -> $($_.Destination)" }
