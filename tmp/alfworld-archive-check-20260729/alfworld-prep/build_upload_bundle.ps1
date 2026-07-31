$ErrorActionPreference = 'Stop'
$bundleRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
& python "$bundleRoot\server\verify_bundle.py" $bundleRoot

$archive = Join-Path (Split-Path -Parent $bundleRoot) 'alfworld-baseline-0.4.2-prep.tar.gz'
if (Test-Path -LiteralPath $archive) {
    Remove-Item -LiteralPath $archive -Force
}

Push-Location (Split-Path -Parent $bundleRoot)
try {
    tar --exclude='alfworld-prep/source/.git' --exclude='__pycache__' -czf $archive 'alfworld-prep'
}
finally {
    Pop-Location
}

Get-FileHash -Algorithm SHA256 -LiteralPath $archive
Write-Host "上传包已生成：$archive"
