# Jenji — Space Station Safety Object Detection

[![GitHub Repo](https://img.shields.io/badge/GitHub-Jenji-blue)](https://github.com/nee-hit476/Jenji/tree/master)

**Jenji** is a real-time object detection application built to detect critical safety objects on a space station using **YOLOv11**. It leverages **Python, Flask-SocketIO, OpenCV, and React** to stream and annotate live webcam feeds, with a WebView desktop launcher for easy deployment.
---

## 📌 Project Structure

```
Jenji/
├─ dataset/
│ └─ data.yaml # YOLO dataset config
├─ src/
│ ├─ training/
│ │ ├─ train.py # Training script
│ │ ├─ eval.py # Evaluation script
│ │ └─ config.yaml # YOLO config
│ ├─ api/
│ │ ├─ app.py # Optional REST API for image upload
│ │ ├─ live_app.py # Flask + SocketIO for live detection
│ │ └─ model_loader.py # YOLO model loader
│ ├─ utils/
│ │ ├─ metrics.py
│ │ └─ viz.py
│ ├─ frontend/
│ │ ├─ package.json
│ │ └─ src/
│ │ ├─ App.tsx
│ │ └─ index.tsx
│ └─ launcher/
│ └─ launch_app.py # WebView-based desktop launcher
├─ runs/ # Training outputs (weights, logs)
├─ environment.yml # Conda environment
├─ Dockerfile # Optional: containerize API
├─ docker-compose.yml # Optional: container orchestration
├─ README.md
└─ REPORT_TEMPLATE.md
```


---

## 🎯 Hackathon Objective

- Detect 7 critical **space station safety objects** under varying conditions:
  - `OxygenTank`, `NitrogenTank`, `FirstAidBox`, `FireAlarm`, `SafetySwitchPanel`, `EmergencyPhone`, `FireExtinguisher`
- Train a **robust YOLO model** on synthetic data from Duality AI’s Falcon simulator.
- Evaluate model performance using **mAP@0.5, Precision, Recall, and Confusion Matrices**.
- (Bonus) Create a desktop or mobile app to use the trained model live.

---

## ⚙ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/nee-hit476/Jenji.git
cd Jenji
```

### 2. Set up Python Environment
```
# Using conda
conda env create -f environment.yml
conda activate jenji
```
**Dependencies include:**
`torch`, `opencv-python`, `flask`, `flask-socketio`, `numpy`, `webview`, `socketio-client`, etc

### 3. Download Dataset

**Ensure dataset/ contains**: 
- train/, val/, test/ folders
- YOLO-compatible .txt labels
- data.yaml describing class names and dataset paths
- run `download_dataset.ps1`

### 4. Train YOLO Model
```cd src/training
python train.py --cfg config.yaml --data ../dataset/data.yaml --epochs 50 --batch-size 16
```
```
Outputs:
Trained weights in runs/yolov11_experiment_x/weights/
Logs and metrics in runs/yolov11_experiment_x/
```

### 5. Evaluate Model Performance
```
python eval.py --weights ../runs/yolov11_experiment_x/weights/best.pt --data ../dataset/data.yaml
```

Generates:
 - mAP@0.5 scores
 - Confusion matrices
 - Precision/Recall metrics

### 6. Run Flask-SocketIO Live Detection

```bash
cd src
python launcher/launch_app.py
```
- Opens WebView desktop window pointing to frontend http://localhost:5173
- Streams webcam frames to Flask server
- Returns annotated frames in real-time

### 7. Frontend Setup (React)
```
cd src/frontend
npm install
npm run dev
```
- Ensure the frontend dev server is running on http://localhost:5173
- Displays live annotated video frames from YOLO

### 8. Using the App

1. Allow camera permissions.
2. Wait for the live feed.
3. YOLO detects objects and overlays bounding boxes:
    - Green box = detected object
    - Label = class name + confidence

# Debugging and Issues Faced

| Issue              | Fix                                                           |
| ------------------ | ------------------------------------------------------------- |
| Webcam not working | Check browser permissions; close other apps using webcam      |
| WebSocket errors   | Ensure backend is running on `http://localhost:8000`          |
| No detections      | Check `MODEL_PATH` in `model_loader.py`; verify weights exist |
| Slow training      | Reduce batch size; monitor GPU usage with `nvidia-smi`        |
