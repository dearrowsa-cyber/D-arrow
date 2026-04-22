Add-Type -AssemblyName System.Windows.Forms
$txtPath = Join-Path $PSScriptRoot "text_to_type.txt"
$textToType = [System.IO.File]::ReadAllText($txtPath, [System.Text.Encoding]::UTF8)

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "You have 5 seconds..." -ForegroundColor Yellow
Write-Host "Please switch to TeamViewer NOW!" -ForegroundColor Yellow
Write-Host "Do NOT touch the mouse or keyboard!" -ForegroundColor Red
Write-Host "======================================================" -ForegroundColor Cyan

Start-Sleep -Seconds 5

[System.Windows.Forms.SendKeys]::SendWait($textToType)

Write-Host "Done Typing!" -ForegroundColor Green
Start-Sleep -Seconds 2
