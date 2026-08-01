$ouUrl = "https://ai.d-arrow.com"

# Login
Write-Host "Logging into Open WebUI..." -ForegroundColor Cyan
$ouBody = '{"email":"info@d-arrow.com","password":"D-Arrow.2026"}'
$ouLogin = Invoke-RestMethod -Uri "$ouUrl/api/v1/auths/signin" -Method POST -ContentType "application/json" -Body $ouBody
$ouToken = $ouLogin.token
$ouHeaders = @{ Authorization = "Bearer $ouToken" }
Write-Host "Logged in!" -ForegroundColor Green

# Step 1: Create Knowledge Collection
Write-Host "`nCreating Knowledge Collection..." -ForegroundColor Cyan
$kbBody = '{"name":"D-Arrow Knowledge Base","description":"Complete knowledge about D-Arrow digital marketing agency - services, pricing, brand values, and content guidelines"}'
try {
    $kb = Invoke-RestMethod -Uri "$ouUrl/api/v1/knowledge/create" -Method POST -ContentType "application/json; charset=utf-8" -Headers $ouHeaders -Body ([System.Text.Encoding]::UTF8.GetBytes($kbBody))
    $kbId = $kb.id
    Write-Host "Knowledge Base created! ID: $kbId" -ForegroundColor Green
} catch {
    Write-Host "Error creating KB: $($_.ErrorDetails.Message)" -ForegroundColor Red
    # Try to get existing ones
    $kbs = Invoke-RestMethod -Uri "$ouUrl/api/v1/knowledge/" -Method GET -Headers $ouHeaders
    Write-Host "Existing knowledge bases:" -ForegroundColor Yellow
    $kbs | ForEach-Object { Write-Host "  $($_.id) - $($_.name)" }
    $kbId = ($kbs | Where-Object { $_.name -like "*D-Arrow*" } | Select-Object -First 1).id
    if (-not $kbId) { $kbId = $kbs[0].id }
    Write-Host "Using KB ID: $kbId" -ForegroundColor Yellow
    exit
}

# Step 2: Upload the knowledge document as a file
Write-Host "`nUploading knowledge document..." -ForegroundColor Cyan
$filePath = Join-Path $PSScriptRoot "darrow_knowledge.md"
$fileContent = [System.IO.File]::ReadAllBytes($filePath)
$fileName = "darrow_knowledge.md"

# Create multipart form data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"
$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
    "Content-Type: text/markdown",
    "",
    [System.Text.Encoding]::UTF8.GetString($fileContent),
    "--$boundary--"
) -join $LF

$uploadBody = [System.Text.Encoding]::UTF8.GetBytes($bodyLines)
$uploadHeaders = @{ 
    Authorization = "Bearer $ouToken"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    $uploadResp = Invoke-RestMethod -Uri "$ouUrl/api/v1/files/" -Method POST -Headers $uploadHeaders -Body $uploadBody
    $fileId = $uploadResp.id
    Write-Host "File uploaded! ID: $fileId" -ForegroundColor Green

    # Step 3: Add file to knowledge base
    Write-Host "`nAdding file to Knowledge Base..." -ForegroundColor Cyan
    $addBody = "{`"file_id`":`"$fileId`"}"
    $addResp = Invoke-RestMethod -Uri "$ouUrl/api/v1/knowledge/$kbId/file/add" -Method POST -ContentType "application/json" -Headers $ouHeaders -Body $addBody
    Write-Host "File added to Knowledge Base!" -ForegroundColor Green

    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "RAG Setup Complete!" -ForegroundColor Green
    Write-Host "Knowledge Base ID: $kbId" -ForegroundColor White
    Write-Host "File ID: $fileId" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Yellow
} catch {
    Write-Host "Upload error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message -ForegroundColor Red
}
