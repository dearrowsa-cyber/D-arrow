$ouUrl = "https://ai.d-arrow.com"

# Login
$ouBody = '{"email":"info@d-arrow.com","password":"D-Arrow.2026"}'
$ouLogin = Invoke-RestMethod -Uri "$ouUrl/api/v1/auths/signin" -Method POST -ContentType "application/json" -Body $ouBody
$ouToken = $ouLogin.token
$ouHeaders = @{ Authorization = "Bearer $ouToken" }

# Get models
$models = Invoke-RestMethod -Uri "$ouUrl/api/models" -Method GET -Headers $ouHeaders
$hasQwen = $models.data | Where-Object { $_.id -eq "qwen2.5:3b" }

if ($hasQwen) {
    Write-Host "DOWNLOADED" -ForegroundColor Green
} else {
    Write-Host "STILL DOWNLOADING" -ForegroundColor Yellow
}
