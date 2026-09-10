$ErrorActionPreference = "Stop"
$backendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$python = Join-Path $backendRoot ".venv\Scripts\python.exe"

if (-not (Test-Path -LiteralPath $python)) {
    throw "Ambiente virtual não encontrado."
}

Set-Location $backendRoot
& $python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

