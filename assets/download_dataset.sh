#!/bin/bash
# ------------------------------------------------------------------------------
# Falcon Hackathon DataSet Downloader
# ------------------------------------------------------------------------------

echo "====================================================="
echo "==> Downloading Falcon Synthetic Dataset" 
echo "====================================================="

# Define Paths
DATASET_PATH="test"
ZIP_PATH="$DATASET_PATH/hackathon2_train_3.zip"
URL="https://storage.googleapis.com/duality-public-share/Datasets/hackathon2_train_3.zip"

# Create dataset directory if missing
if [ ! -d "$DATASET_PATH" ]; then
    mkdir -p "$DATASET_PATH"
fi

# Download dataset from the endpoint
echo "Downloading dataset from the url ....."
curl -L -o "$ZIP_PATH" "$URL"

# Extracting the dataset
echo "Extracting dataset ....."
unzip -q "$ZIP_PATH" -d "$DATASET_PATH"

# Cleanup
rm "$ZIP_PATH"

echo "==> Dataset ready under /dataset/"
echo "   - images/train/"
echo "   - images/val/"
echo "   - images/test/"
echo ""
echo "Next steps:"
echo "   conda activate EDU"
echo "   python src/training/train.py --cfg src/training/config.yaml"