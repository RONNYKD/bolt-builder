# Run as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    Break
}

# Stop any running Node.js processes
Write-Host "Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Wait a moment for processes to stop
Start-Sleep -Seconds 2

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Remove existing node_modules and package-lock.json with retry logic
Write-Host "Removing existing node_modules and package-lock.json..." -ForegroundColor Yellow
$maxAttempts = 3
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        if (Test-Path "node_modules") {
            Remove-Item -Path "node_modules" -Recurse -Force
        }
        if (Test-Path "package-lock.json") {
            Remove-Item -Path "package-lock.json" -Force
        }
        break
    }
    catch {
        $attempt++
        Write-Host "Attempt $attempt failed. Waiting before retry..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

# Install dependencies with specific versions
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install --legacy-peer-deps

# Install specific problematic dependencies
Write-Host "Installing specific dependencies..." -ForegroundColor Green
npm install --legacy-peer-deps @codesandbox/sandpack-react@latest
npm install --legacy-peer-deps @xterm/xterm@latest @xterm/addon-fit@latest @xterm/addon-web-links@latest @xterm/addon-search@latest

# Update deprecated packages
Write-Host "Updating deprecated packages..." -ForegroundColor Green
npm install --legacy-peer-deps @eslint/config-array @eslint/object-schema

Write-Host "Installation complete!" -ForegroundColor Green 