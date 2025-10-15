#!/bin/bash
# -----------------------------------------------
# Falcon YOLOv8 Hackathon Environment Setup (Linux/macOS)
# -----------------------------------------------

echo "======================================"
echo "[1/5] Checking for Conda installation..."
echo "======================================"

if ! command -v conda &> /dev/null; then
    echo "ERROR: Conda not found! Please install Anaconda or Miniconda first."
    exit 1
fi

echo "================================"
echo "[2/5] Creating Conda environment"
echo "================================"

if conda env list | grep -q "^EDU "; then
    echo "WARNING: Environment 'EDU' already exists. Skipping creation."
else
    conda env create -f environment.yml
fi

echo "============================"
echo "[3/5] Activating environment"
echo "============================"

# Initialize conda for bash shell if not already done
eval "$(conda shell.bash hook)"
conda activate EDU

echo "============================="
echo "[4/5] Installing pip packages"
echo "============================="

pip install --upgrade pip
pip install ultralytics flask opencv-python-headless tensorboard wandb seaborn requests

echo "======================================="
echo "[5/5] Environment setup completed"
echo "======================================="
echo ""
echo "Run the following command before training:"
echo "    conda activate EDU"
echo ""
echo "To start training:"
echo "    python src/training/train.py --cfg src/training/config.yaml"
echo ""
echo "To start API:"
echo "    python src/api/app.py"
echo ""