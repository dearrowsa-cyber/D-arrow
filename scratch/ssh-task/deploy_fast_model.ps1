$ouUrl = "https://ai.d-arrow.com"

# Login
Write-Host "Logging into Open WebUI..." -ForegroundColor Cyan
$ouBody = '{"email":"info@d-arrow.com","password":"D-Arrow.2026"}'
$ouLogin = Invoke-RestMethod -Uri "$ouUrl/api/v1/auths/signin" -Method POST -ContentType "application/json" -Body $ouBody
$ouToken = $ouLogin.token
$ouHeaders = @{ Authorization = "Bearer $ouToken"; "Content-Type" = "application/json" }
Write-Host "Logged in!" -ForegroundColor Green

# Read JSON configuration
$jsonPath = Join-Path $PSScriptRoot "saudi_fast_model.json"
$modelConfig = Get-Content -Path $jsonPath -Raw -Encoding UTF8

Write-Host "`nDeploying D-Arrow AI (Fast)..." -ForegroundColor Cyan

# Delete first if it exists
try {
    Invoke-RestMethod -Uri "$ouUrl/api/v1/models/darrow-ai-fast" -Method DELETE -Headers $ouHeaders -ErrorAction SilentlyContinue
} catch { }

try {
    $result = Invoke-RestMethod -Uri "$ouUrl/api/v1/models/create" -Method POST -Headers $ouHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($modelConfig))
    Write-Host "Fast Saudi Model created! ID: $($result.id)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
