# PowerShell script to clean unnecessary files and directories
Remove-Item -Recurse -Force coverage, lcov-report, docs\generated, tmp, node_modules\.cache
Write-Host "Project cleaned successfully!"
