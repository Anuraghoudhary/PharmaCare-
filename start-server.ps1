Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting Pharmacy Management System...  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Maven is already downloaded locally
if (-not (Test-Path ".\maven\apache-maven-3.9.6\bin\mvn.cmd")) {
    Write-Host "Downloading Maven (this will only happen once)..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile "maven.zip"
    
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path "maven.zip" -DestinationPath "maven" -Force
    
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    Remove-Item "maven.zip"
}

Write-Host "Starting the Java Spring Boot Backend..." -ForegroundColor Green
Write-Host "Please wait a few seconds until you see 'Started PmsApplication'." -ForegroundColor Green
Write-Host "Then, open http://localhost:8080 in your browser!" -ForegroundColor Green

# Run Spring Boot
.\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
