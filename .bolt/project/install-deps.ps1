# Run as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    Break
}

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Remove existing node_modules and package-lock.json
Write-Host "Removing existing node_modules and package-lock.json..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install --legacy-peer-deps

# Install specific problematic dependency
Write-Host "Installing @codesandbox/sandpack-react..." -ForegroundColor Green
npm install --legacy-peer-deps @codesandbox/sandpack-react

Write-Host "Installation complete!" -ForegroundColor Green 