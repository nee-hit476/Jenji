@echo off
REM -----------------------------------------------
REM Falcon YOLOv8 Hackathon Environment Setup (Windows)
REM -----------------------------------------------

echo ======================================
echo [1/5] Checking for Conda installation...
echo ======================================

where conda >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Conda not found! Please install Anaconda or Miniconda first.
    pause
    exit /b
)

echo ================================
echo [2/5] Creating Conda environment
echo ================================

IF EXIST "%USERPROFILE%\anaconda3\envs\EDU" (
    echo ⚠️ Environment 'EDU' already exists. Skipping creation.
) ELSE (
    conda env create -f environment.yml
)

echo ==========================
echo [3/5] Activating environment
echo ==========================
call conda activate EDU

echo =============================
echo [4/5] Installing pip packages
echo =============================
pip install --upgrade pip
pip install ultralytics flask opencv-python-headless tensorboard wandb seaborn requests

echo =======================================
echo [5/5] Environment setup completed ✅
echo =======================================
echo.
echo Run the following command before training:
echo     conda activate EDU
echo.
echo To start training:
echo     python src\training\train.py --cfg src\training\config.yaml
echo.
echo To start API:
echo     python src\api\app.py
echo.
pause
