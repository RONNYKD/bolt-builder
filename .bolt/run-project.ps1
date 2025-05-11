# PowerShell script to setup Node.js environment and run the project
Write-Host "Setting up Node.js environment..." -ForegroundColor Cyan

# Use nvm to install and use Node.js 20.15.1
Write-Host "Installing Node.js v20.15.1 using nvm..." -ForegroundColor Yellow
nvm install 20.15.1
nvm use 20.15.1

# Locate the actual nvm installation directories
$potentialNodePaths = @(
    "$env:USERPROFILE\scoop\apps\nvm\current\v20.15.1",
    "$env:USERPROFILE\AppData\Roaming\nvm\v20.15.1",
    "$env:USERPROFILE\scoop\persist\nvm\nodejs\node-v20.15.1-win-x64",
    "$env:USERPROFILE\AppData\Local\nvm\v20.15.1"
)

$nodePath = $null
foreach ($path in $potentialNodePaths) {
    Write-Host "Checking path: $path" -ForegroundColor Gray
    if (Test-Path "$path\node.exe") {
        $nodePath = $path
        Write-Host "Found Node.js at: $nodePath" -ForegroundColor Green
        break
    }
}

# If the above methods failed, try finding Node.js in the system PATH
if (-not $nodePath) {
    $nodeExeFromPath = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeExeFromPath) {
        $nodePath = Split-Path -Parent $nodeExeFromPath.Path
        Write-Host "Found Node.js from PATH at: $nodePath" -ForegroundColor Green
    }
}

# If we still can't find Node.js, try a more generic search
if (-not $nodePath) {
    Write-Host "Searching for Node.js installation..." -ForegroundColor Yellow
    $searchPaths = @(
        "$env:USERPROFILE\scoop",
        "$env:USERPROFILE\AppData",
        "C:\Program Files\nodejs"
    )
    
    foreach ($base in $searchPaths) {
        $foundExes = Get-ChildItem -Path $base -Filter "node.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($foundExes) {
            $nodePath = Split-Path -Parent $foundExes.FullName
            Write-Host "Found Node.js through search at: $nodePath" -ForegroundColor Green
            break
        }
    }
}

# If we still can't find Node.js, give up
if (-not $nodePath) {
    Write-Host "Could not locate Node.js installation. Please install Node.js manually." -ForegroundColor Red
    exit 1
}

# Set PATH to prioritize our Node.js installation
$env:PATH = "$nodePath;$env:PATH"

# Verify Node.js and npm versions
try {
    $nodeVersion = & "$nodePath\node.exe" --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    
    $npmCmd = if (Test-Path "$nodePath\npm.cmd") { "$nodePath\npm.cmd" } else { "$nodePath\npm" }
    $npmVersion = & $npmCmd --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error verifying Node.js installation: $_" -ForegroundColor Red
    exit 1
}

# Navigate to the project directory
cd "$PSScriptRoot\project"
Write-Host "Changed to directory: $(Get-Location)" -ForegroundColor Cyan

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies (this may take a while)..." -ForegroundColor Yellow
    & $npmCmd install --no-fund
} else {
    Write-Host "Dependencies already installed" -ForegroundColor Green
}

# Run the development server
Write-Host "Starting the development server..." -ForegroundColor Green
& $npmCmd run dev 