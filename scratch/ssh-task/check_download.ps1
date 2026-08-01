$PortainerUrl = "https://apps.d-arrow.com"
$EnvId = 3
$ContainerId = "2b30dc17c4208b6e86361e83b130327d802c48bc5c0f68197abbe4b1867f1475"

# Login
$loginBody = '{"username":"d-arrow","password":"D-Arrow.2026"}'
$login = Invoke-RestMethod -Uri "$PortainerUrl/api/auth" -Method POST -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.jwt)" }

# Check models
$execBody = '{"AttachStdout":true,"AttachStderr":true,"Tty":false,"Cmd":["ollama","list"]}'
$exec = Invoke-RestMethod -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/containers/$ContainerId/exec" -Method POST -ContentType "application/json" -Headers $headers -Body $execBody
$resp = Invoke-WebRequest -Uri "$PortainerUrl/api/endpoints/$EnvId/docker/exec/$($exec.Id)/start" -Method POST -ContentType "application/json" -Headers $headers -Body '{"Detach":false}' -TimeoutSec 10
[System.Text.Encoding]::UTF8.GetString($resp.Content) -replace '[^a-zA-Z0-9-:\.\s]', ''
