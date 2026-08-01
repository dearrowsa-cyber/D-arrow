$PortainerUrl = "https://apps.d-arrow.com"
$EnvId = 3

# Login
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$login = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.jwt)" }

# Create a temporary container to check host hardware (run lspci)
$containerBody = @{
    Image = "ubuntu:latest"
    Cmd = @("sh", "-c", "apt-get update && apt-get install -y pciutils && lspci | grep -i vga")
    HostConfig = @{
        AutoRemove = $true
    }
} | ConvertTo-Json -Depth 5

try {
    $create = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/create" -Method POST -ContentType "application/json" -Headers $headers -Body $containerBody
    $id = $create.Id
    
    Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$id/start" -Method POST -Headers $headers
    Start-Sleep -Seconds 10
    
    $logs = Invoke-WebRequest -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$id/logs?stdout=true&stderr=true" -Method GET -Headers $headers
    Write-Host "Hardware Check Results:" -ForegroundColor Green
    Write-Host ([System.Text.Encoding]::UTF8.GetString($logs.Content))
} catch {
    Write-Host "Error checking hardware: $($_.Exception.Message)" -ForegroundColor Red
}
