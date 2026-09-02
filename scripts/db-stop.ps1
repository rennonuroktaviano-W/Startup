$procs = Get-Process mysqld -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*laragon*bin*mysql*" }
if (-not $procs) { Write-Host "MySQL dev instance tidak berjalan."; exit 0 }
foreach ($p in $procs) { Stop-Process -Id $p.Id -Force }
Write-Host "MySQL dev instance dihentikan."