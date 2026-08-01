$ouUrl = "https://ai.d-arrow.com"

# Login to Open WebUI
Write-Host "Logging into Open WebUI..." -ForegroundColor Cyan
$ouBody = '{"email":"info@d-arrow.com","password":"D-Arrow.2026"}'
$ouLogin = Invoke-RestMethod -Uri "$ouUrl/api/v1/auths/signin" -Method POST -ContentType "application/json" -Body $ouBody
$ouToken = $ouLogin.token
$ouHeaders = @{ Authorization = "Bearer $ouToken"; "Content-Type" = "application/json" }
Write-Host "Logged in!" -ForegroundColor Green

# Read JSON configuration
$jsonPath = Join-Path $PSScriptRoot "saudi_model.json"
$modelConfig = Get-Content -Path $jsonPath -Raw -Encoding UTF8

Write-Host "`nUpdating D-Arrow AI to Saudi Persona..." -ForegroundColor Cyan

# We use the update endpoint for the existing model
try {
    # Delete first to make sure it gets re-created clean
    Invoke-RestMethod -Uri "$ouUrl/api/v1/models/darrow-ai" -Method DELETE -Headers $ouHeaders -ErrorAction SilentlyContinue
    Write-Host "Old model removed." -ForegroundColor Yellow
} catch { }

try {
    $result = Invoke-RestMethod -Uri "$ouUrl/api/v1/models/create" -Method POST -Headers $ouHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($modelConfig))
    Write-Host "Saudi Model created! ID: $($result.id)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
