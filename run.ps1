# Fireflies.ai Clone - Launch Script for PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Fireflies.ai Clone - Launching Fullstack Platform" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Seed database
Write-Host "[1/3] Checking and seeding SQLite database..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\backend"
python seed.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to seed database. Make sure Python and dependencies are installed." -ForegroundColor Red
    Pop-Location
    exit $LASTEXITCODE
}
Pop-Location

# 2. Launch Backend in new window
Write-Host "[2/3] Starting FastAPI Backend on port 8000..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d ""$PSScriptRoot\backend"" && python -m uvicorn main:app --reload --port 8000"

# 3. Launch Frontend in new window
Write-Host "[3/3] Starting Next.js Frontend on port 3000..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d ""$PSScriptRoot\frontend"" && npm.cmd run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host " Platform successfully started!" -ForegroundColor Green
Write-Host "  - Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "  - Swagger Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
