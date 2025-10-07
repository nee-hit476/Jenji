# ------------------------------------------------------------------------------
# Falcon Hackathon DataSet Downloader
# ------------------------------------------------------------------------------

Write-Host "====================================================="
Write-Host "==> Downloading Falcon Synthetic Dataset" 
Write-Host "====================================================="

# Define Paths
$datasetPath = "test"
$zipPath = "$datasetPath/hackathon2_train_3.zip"
$url = "https://storage.googleapis.com/duality-public-share/Datasets/hackathon2_train_3.zip"

# create dataset directory if missing
if (!(Test-Path $datasetPath)) {
    New-Item -ItemType Directory -Force -Path $datasetPath | Out-Null
}

# Download dataset from the endpoint
Write-Host "Downloading dataset from the url ....."
Invoke-WebRequest -Uri $url -OutFile $zipPath

# Extracting the dataset
Write-Host "Extracting dataset ....."
Expand-Archive -Path $zipPath -DestinationPath $datasetPath -Force

# cleanup
Remove-Item $zipPath


Write-Host "==> Dataset ready under /dataset/"
Write-Host "   - images/train/"
Write-Host "   - images/val/"
Write-Host "   - images/test/"
Write-Host ""
Write-Host "Next steps:"
Write-Host "   conda activate EDU"
Write-Host "   python src/training/train.py --cfg src/training/config.yaml"