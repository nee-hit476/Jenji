<div
  style="display:flex; margin:10px 0px; justify-content:space-around;  align-items:center; flex-direction:column;"
>
<div align="center">
  <img src="assets/jenji.png" alt="Jenji Logo" width="100" height="100"/>
</div>
<div align="center" style="font-size:1.8rem; width:400px; margin-left:1px; font-weight:bold;">Jenji — Space Station Safety Object Detection</div>

</div>

<p align="center">
  <a href="https://github.com/nee-hit476/Jenji/tree/master">
    <img src="https://img.shields.io/badge/GitHub-Jenji-blue" alt="GitHub Repo"/>
  </a>
</p>

---


<p style="font-size:1.5rem; font-weight:600;"> <span style="font-weight:800;">Jenji</span> is a real-time object detection application built to detect critical safety objects on a space station using <span style="font-weight:800;">YOLOv11</span>. It leverages <span style="font-weight:800;">Python, Flask-SocketIO, OpenCV, and React</span> to stream and annotate live webcam feeds, with a WebView desktop launcher for easy deployment.
</p>



<div style="display:flex; gap:4; align-items:center; margin-bottom:5px;"><img src="assets/jenji.png" width="30"></img><span style="margin-left:5px; font-size:1.5rem; font-weight:bold;">Jenji AI Glimpse</span></div>

--- 

![image](/assets/landing.png)
![image](/assets/detection.png)

<div style="display:flex; gap:4; align-items:center; margin-bottom:5px;"><img src="assets/jenji.png" width="30"></img><span style="margin-left:5px; font-size:1.5rem; font-weight:bold;">Jenji AI Scores</span></div>

--- 

![image](/assets/trained_scores.png)
![image](/assets/dat.png)

<div style="display:flex; gap:4; align-items:center; margin-bottom:5px;"><img src="assets/jenji.png" width="30"></img><span style="margin-left:5px; font-size:1.5rem; font-weight:bold;">Jenji AI Project Structure</span></div>

--- 

```
Jenji/
├─ assets/
├─ ENV_SETUP # files for setting up conda environment
├─ runs_test # a examine folder independent of project
├─ dataset/
│ └─ data.yaml # YOLO dataset config
├─ src/
│ ├─ training/
│ │ ├─ train.py # Training script
│ │ ├─ eval.py # Evaluation script
│ │ └─ config.yaml # YOLO config
│ ├─ api/
│ │ ├─ app.py # Optional REST API for image upload
| | ├─ config.py
| | ├─ detection_service.py
| | ├─ detection_visualizer.py
| | ├─ image_processor.py
| | ├─ socket_handlers.py
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
├─ docker-compose.yml 
├─ README.md
└─ REPORT_TEMPLATE.md
```

## 🎯 Hackathon Objective

- Detect 7 critical **space station safety objects** under varying conditions:
  - `OxygenTank`, `NitrogenTank`, `FirstAidBox`, `FireAlarm`, `SafetySwitchPanel`, `EmergencyPhone`, `FireExtinguisher`
- Train a **robust YOLO model** on synthetic data from Duality AI’s Falcon simulator.
- Evaluate model performance using **mAP@0.5, Precision, Recall, and Confusion Matrices**.
- (Bonus) Create a desktop or mobile app to use the trained model live.

---

## ⚙ Start a project
```
./download_dataset.ps1
make train
make run 
```
### frontend 
```
make install-client
make client
```

### backend
```
make backend # after dataset downloaded and model train
```

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
