$PortainerUrl = "https://apps.d-arrow.com"
$Username = "d-arrow"
$Password = "D-Arrow.2026"

Write-Host "Logging into Portainer..." -ForegroundColor Cyan

# Step 1: Login
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$loginResponse = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.jwt
Write-Host "Logged in OK!" -ForegroundColor Green

$headers = @{ Authorization = "Bearer $token" }

# Step 2: Get environments
Write-Host "Getting environments..." -ForegroundColor Cyan
$endpoints = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints" -Method GET -Headers $headers
foreach ($ep in $endpoints) {
    Write-Host "  ID=$($ep.Id)  Name=$($ep.Name)  Status=$($ep.Status)"
}
$envId = $endpoints[0].Id
Write-Host "Using Environment ID: $envId" -ForegroundColor Green

# Step 3: Read compose file
$composePath = Join-Path $PSScriptRoot "ollama-compose.yml"
$composeContent = Get-Content -Path $composePath -Raw
Write-Host "Compose file loaded ($($composeContent.Length) chars)" -ForegroundColor Green

# Step 4: Build JSON body manually to avoid escaping issues
$escapedCompose = $composeContent -replace '\\', '\\\\' -replace '"', '\"' -replace "`r`n", '\n' -replace "`n", '\n'
$jsonBody = "{`"name`":`"ollama`",`"stackFileContent`":`"$escapedCompose`",`"endpointId`":$envId}"

# Step 5: Deploy stack
Write-Host "Deploying Ollama stack..." -ForegroundColor Cyan
try {
    $result = Invoke-RestMethod -Uri "$PortainerUrl/api/stacks/create/standalone/string?endpointId=$envId" -Method POST -ContentType "application/json" -Headers $headers -Body $jsonBody
    Write-Host "Stack deployed! ID=$($result.Id)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
}
