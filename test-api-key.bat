@echo off
REM Test Grok API Key

setlocal enabledelayedexpansion

echo.
echo ========================================
echo    Grok API Key Validation Test
echo ========================================
echo.

set "API_KEY=xai-pVkuyzhzoyhtRFZ9euPV0Rtms6A0TdrYkjcfVIWXoAmzWjlwEaAAFFJCV46rKgxtZdMYZ4tBkSgKraBl"

echo [1/3] Checking API Key Format...
echo API Key: %API_KEY:~0,10%...%API_KEY:~-5%

if "%API_KEY:~0,4%"=="xai-" (
    echo ✓ Format: VALID (starts with xai-)
) else (
    echo ✗ Format: INVALID (should start with xai-)
    goto error
)

echo.
echo [2/3] Testing API Connection...
echo Sending test request to Grok API...
echo.

powershell -NoProfile -Command ^
  "$body = @{messages=@(@{role='user';content='hi'});model='grok-4-latest';stream=$false;temperature=0}|ConvertTo-Json;" ^
  "$headers=@{'Content-Type'='application/json';'Authorization'='Bearer %API_KEY%'};" ^
  "try {" ^
  "  $r=Invoke-WebRequest -Uri 'https://api.x.ai/v1/chat/completions' -Method POST -Headers $headers -Body $body -TimeoutSec 10 -ErrorAction Stop;" ^
  "  Write-Host 'Status: 200 OK';" ^
  "  Write-Host '✓ API Connection: SUCCESS';" ^
  "} catch {" ^
  "  $s=$_.Exception.Response.StatusCode;" ^
  "  Write-Host \"Status: $s\";" ^
  "  Write-Host '✗ API Connection: FAILED';" ^
  "  Write-Host \"Error: $($_.Exception.Message)\";" ^
  "}"

echo.
echo [3/3] Result Summary
echo ========================================

echo.
echo If you see:
echo   ✓ Format: VALID
echo   ✓ API Connection: SUCCESS
echo.
echo Then your API key is working! 
echo Run: npm run dev
echo.
echo If you see 403/401 error:
echo   1. Go to: https://console.x.ai
echo   2. Generate a new API key
echo   3. Update .env.local
echo   4. Run this test again
echo.

pause
goto end

:error
echo.
echo ERROR: API Key format is invalid!
echo Please check .env.local
echo.
pause

:end
