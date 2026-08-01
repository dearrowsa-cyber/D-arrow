$n8nUrl = "https://n8n.d-arrow.com"

Write-Host "Logging into n8n..." -ForegroundColor Cyan

# n8n uses emailOrLdapLoginId
$n8nBody = '{"emailOrLdapLoginId":"info@d-arrow.com","password":"D-Arrow.2026"}'
$n8nLogin = Invoke-RestMethod -Uri "$n8nUrl/rest/login" -Method POST -ContentType "application/json" -Body $n8nBody -SessionVariable session
Write-Host "n8n Login OK: $($n8nLogin.data.email)" -ForegroundColor Green

# Get CSRF token or cookie
$cookies = $session.Cookies.GetCookies("$n8nUrl")
Write-Host "Cookies:" -ForegroundColor Cyan
$cookies | ForEach-Object { Write-Host "  $($_.Name) = $($_.Value.Substring(0, [Math]::Min(30,$_.Value.Length)))..." }

# Check existing credentials
Write-Host "`nChecking credentials..." -ForegroundColor Cyan
$creds = Invoke-RestMethod -Uri "$n8nUrl/rest/credentials" -Method GET -WebSession $session
$creds.data | ForEach-Object { Write-Host "  $($_.name) | $($_.type)" }

# Check if Ollama credential exists
$ollamaCred = $creds.data | Where-Object { $_.type -like "*ollama*" -or $_.name -like "*ollama*" }
if ($ollamaCred) {
    Write-Host "`nOllama credential already exists: $($ollamaCred.name)" -ForegroundColor Green
} else {
    Write-Host "`nCreating Ollama credential..." -ForegroundColor Yellow
    $credBody = '{"name":"Ollama Local","type":"ollamaApi","data":{"baseUrl":"http://ollama:11434"}}'
    $newCred = Invoke-RestMethod -Uri "$n8nUrl/rest/credentials" -Method POST -ContentType "application/json" -Body $credBody -WebSession $session
    Write-Host "Created! ID: $($newCred.data.id)" -ForegroundColor Green
}
