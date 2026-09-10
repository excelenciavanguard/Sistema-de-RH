$ErrorActionPreference = "Stop"
$mysqlBinary = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
$configPath = Join-Path $PSScriptRoot "..\mysql.local.ini"

if (-not (Test-Path -LiteralPath $mysqlBinary)) {
    throw "MySQL Server 8.4 não encontrado."
}
if (-not (Test-Path -LiteralPath $configPath)) {
    throw "Configuração local do MySQL não encontrada."
}
if (Get-NetTCPConnection -LocalPort 3307 -State Listen -ErrorAction SilentlyContinue) {
    Write-Output "MySQL Alpha RH já está ativo em 127.0.0.1:3307."
    exit 0
}

Start-Process -FilePath $mysqlBinary -ArgumentList "`"--defaults-file=$configPath`"" -WindowStyle Hidden
$ready = $false
for ($attempt = 0; $attempt -lt 15; $attempt++) {
    Start-Sleep -Seconds 1
    if (Get-NetTCPConnection -LocalPort 3307 -State Listen -ErrorAction SilentlyContinue) {
        $ready = $true
        break
    }
}
if (-not $ready) {
    throw "O MySQL não iniciou. Consulte o arquivo de erro na pasta de dados local."
}
Write-Output "MySQL Alpha RH iniciado em 127.0.0.1:3307."
