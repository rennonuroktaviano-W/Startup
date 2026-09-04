param(
  [int]$Port = 3307
)
# Starts the project-local MySQL dev instance (see .data/mysql/my.cnf).
$exists = Test-Path -LiteralPath ".data\mysql\my.cnf"
if (-not $exists) { throw "my.cnf not found. Run setup once first." }

$procs = Get-Process mysqld -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*laragon*bin*mysql*" }
if ($procs) {
  Write-Host "MySQL dev instance sudah berjalan. (PID $($procs.Id -join ','))"
  exit 0
}

$conf = Join-Path (Get-Location) ".data\mysql\my.cnf"
$log = Join-Path (Get-Location) ".data\mysql\mysqld.log"
$err = Join-Path (Get-Location) ".data\mysql\mysqld-err.log"
Start-Process "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe" `
  -ArgumentList "--defaults-file=`"$conf`"" `
  -RedirectStandardOutput $log -RedirectStandardError $err -WindowStyle Hidden
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Milliseconds 500
  $out = & "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqladmin.exe" ping -h 127.0.0.1 -P $Port 2>$null
  if ($out -match "alive") { Write-Host "MySQL dev instance berjalan di port $Port."; exit 0 }
}
Write-Host "MySQL tidak merespons. Cek $log / $err"
exit 1