# Deploy script for workout-assistant-v2
# Ensures SSH key is loaded before deploying

Write-Host "Checking SSH key..." -ForegroundColor Cyan

# Check if key is already loaded
$keyLoaded = ssh-add -l 2>&1 | Select-String "id_rsa_github_vikeshpateldev"

if (-not $keyLoaded) {
    Write-Host "SSH key not found in agent. Adding key..." -ForegroundColor Yellow
    Write-Host "You may be prompted for your passphrase." -ForegroundColor Yellow
    ssh-add "$env:USERPROFILE\.ssh\id_rsa_github_vikeshpateldev"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to add SSH key. Please run manually:" -ForegroundColor Red
        Write-Host "  ssh-add `$env:USERPROFILE\.ssh\id_rsa_github_vikeshpateldev" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "SSH key already loaded." -ForegroundColor Green
}

# Ensure remote is set to SSH
Write-Host "`nVerifying git remote..." -ForegroundColor Cyan
$remoteUrl = git remote get-url origin
if ($remoteUrl -notlike "*git@github.com*") {
    Write-Host "Setting remote to SSH..." -ForegroundColor Yellow
    git remote set-url origin git@github.com:VikeshPatelDev/workout-assistant-v2.git
}

# Configure Git to use system SSH (so it can access the SSH agent)
# This is needed because Git for Windows uses its own SSH that doesn't access Windows SSH agent
Write-Host "Configuring Git to use system SSH..." -ForegroundColor Cyan
$systemSsh = (Get-Command ssh).Source
$env:GIT_SSH_COMMAND = "`"$systemSsh`""

# Deploy
Write-Host "`nDeploying to GitHub Pages..." -ForegroundColor Cyan
npm run deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDeployment successful!" -ForegroundColor Green
    Write-Host "Your site will be available at:" -ForegroundColor Cyan
    Write-Host "https://VikeshPatelDev.github.io/workout-assistant-v2" -ForegroundColor Yellow
} else {
    Write-Host "`nDeployment failed!" -ForegroundColor Red
    exit 1
}

