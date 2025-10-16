import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Database, Cpu, Play, Rocket, Bug } from 'lucide-react';
import { ShootingStars } from './[ui]/shooting-stars';
import { StarsBackground } from './[ui]/stars-background';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-black scroll-smooth">
      
      <div className="fixed inset-0 w-full h-full z-0">
        <StarsBackground />
        <ShootingStars />
      </div>
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        <div className="relative z-10 pt-1 pb-20 px-4 sm:px-6 lg:px-8 pointer-events-auto">
          <Link to="/" className="inline-flex z-50 items-center space-x-2 text-gray-500 mb-8 transition hover:text-gray-300">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-5xl font-bold text-white mb-6">Documentation</h1>
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            Complete setup and usage guide for Jenji — a real-time object detection app for
            space-station safety items (built with YOLOv11, Flask-SocketIO and React).
          </p>

          {/* Hackathon Objective */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">🎯 Hackathon Objective</h2>
            <p className="text-gray-300 mb-3">Detect 7 critical space station safety objects under varying conditions:</p>
            <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
              <li>OxygenTank</li>
              <li>NitrogenTank</li>
              <li>FirstAidBox</li>
              <li>FireAlarm</li>
              <li>SafetySwitchPanel</li>
              <li>EmergencyPhone</li>
              <li>FireExtinguisher</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-600">
              <p className="text-white font-semibold mb-2">Key Goals:</p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                <li>Train a robust YOLO model on synthetic data from Duality AI's Falcon simulator</li>
                <li>Evaluate model performance using mAP@0.5, Precision, Recall, and Confusion Matrices</li>
                <li><span className="text-cyan-400">(Bonus)</span> Create a desktop or mobile app to use the trained model live</li>
              </ul>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-black backdrop-blur border border-cyan-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
              <Rocket className="w-7 h-7 text-cyan-400" />
              <span>Quick Start</span>
            </h2>
            <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-4">
              <code className="text-gray-400 text-sm">
                ./download_dataset.ps1<br />
                make train<br />
                make run
              </code>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-white font-semibold mb-2">Frontend:</p>
                <div className="bg-gray-900/30 rounded-lg p-3 border border-slate-600">
                  <code className="text-gray-400 text-sm">
                    make install-client<br />
                    make client
                  </code>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-2">Backend:</p>
                <div className="bg-gray-900/30 rounded-lg p-3 border border-slate-600">
                  <code className="text-gray-400 text-sm">
                    make backend
                  </code>
                </div>
                <p className="text-gray-400 text-xs mt-2">After dataset downloaded and model trained</p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
              <Terminal className="w-8 h-8 text-cyan-400" />
              <span>Setup Instructions</span>
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Clone Repository</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600">
                  <code className="text-gray-400 text-sm">
                    git clone https://github.com/nee-hit476/Jenji.git<br />
                    cd Jenji
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Set up Python Environment</h3>
                <p className="text-gray-300 mb-3">Using conda:</p>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600">
                  <code className="text-gray-400 text-sm">
                    conda env create -f environment.yml<br />
                    conda activate jenji
                  </code>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Dependencies include: torch, opencv-python, flask, flask-socketio, numpy, webview, socketio-client
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Download Dataset</h3>
                <p className="text-gray-300 mb-3">Ensure dataset/ contains:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mb-3">
                  <li>train/, val/, test/ folders</li>
                  <li>YOLO-compatible .txt labels</li>
                  <li>data.yaml describing class names and dataset paths</li>
                </ul>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600">
                  <code className="text-gray-400 text-sm">
                    ./download_dataset.ps1
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Training */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
              <Cpu className="w-8 h-8 text-cyan-400" />
              <span>Model Training & Evaluation</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">4. Train YOLO Model</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-gray-400 text-sm">
                    cd src/training<br />
                    python train.py --cfg config.yaml --data ../dataset/data.yaml --epochs 50 --batch-size 16
                  </code>
                </div>
                <p className="text-gray-300 mb-2">Outputs:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                  <li>Trained weights in runs/yolov11_experiment_x/weights/</li>
                  <li>Logs and metrics in runs/yolov11_experiment_x/</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">5. Evaluate Model Performance</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-gray-400 text-sm">
                    python eval.py --weights ../runs/yolov11_experiment_x/weights/best.pt --data ../dataset/data.yaml
                  </code>
                </div>
                <p className="text-gray-300 mb-2">Generates:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                  <li>mAP@0.5 scores</li>
                  <li>Confusion matrices</li>
                  <li>Precision/Recall metrics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Running the App */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
              <Play className="w-8 h-8 text-cyan-400" />
              <span>Running the Application</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">6. Run Flask-SocketIO Live Detection</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-gray-400 text-sm">
                    cd src<br />
                    python launcher/launch_app.py
                  </code>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                  <li>Opens WebView desktop window pointing to frontend http://localhost:5173</li>
                  <li>Streams webcam frames to Flask server</li>
                  <li>Returns annotated frames in real-time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">7. Frontend Setup (React)</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-gray-400 text-sm">
                    cd src/frontend<br />
                    npm install<br />
                    npm run dev
                  </code>
                </div>
                <p className="text-gray-300">
                  Ensure the frontend dev server is running on http://localhost:5173
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Displays live annotated video frames from YOLO
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">8. Using the App</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                  <li>Allow camera permissions</li>
                  <li>Wait for the live feed to initialize</li>
                  <li>YOLO detects objects and overlays bounding boxes</li>
                  <li><span className="text-green-400">Green box</span> = detected object with class name + confidence</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Docker (Optional)</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-gray-400 text-sm">
                    # build image from project root<br />
                    docker build -t jenji-app .<br />
                    # run container (maps port 8080)<br />
                    docker run --rm -p 8080:8080 -e MODEL_PATH=runs/yolov11_experiment_01/weights/best.pt jenji-app
                  </code>
                </div>
                <p className="text-gray-300 text-sm">Or use docker-compose:</p>
                <div className="bg-gray-900/30 rounded-lg p-3 border border-slate-600 mt-2">
                  <code className="text-gray-400 text-sm">docker compose up --build</code>
                </div>
              </div>
            </div>
          </div>

          {/* Debugging Section */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
              <Bug className="w-8 h-8 text-cyan-400" />
              <span>Debugging and Issues Faced</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="py-3 px-4 text-white font-semibold">Issue</th>
                    <th className="py-3 px-4 text-white font-semibold">Fix</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-3 px-4">Webcam not working</td>
                    <td className="py-3 px-4">Check browser permissions; close other apps using webcam</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-3 px-4">WebSocket errors</td>
                    <td className="py-3 px-4">Ensure backend is running on http://localhost:8000</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-3 px-4">No detections</td>
                    <td className="py-3 px-4">Check MODEL_PATH in model_loader.py; verify weights exist</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Slow training</td>
                    <td className="py-3 px-4">Reduce batch size; monitor GPU usage with nvidia-smi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Project Structure */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
              <Database className="w-8 h-8 text-cyan-400" />
              <span>Project Structure</span>
            </h2>
            <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600">
              <pre className="text-gray-400 text-sm overflow-x-auto">
{`Jenji/
├─ .vscode/                    # VS Code configuration
├─ assets/                     # Project assets (images, logos)
├─ dataset/                    # YOLO dataset
│  └─ data.yaml               # YOLO dataset config
├─ ENV_SETUP/                  # Files for setting up conda environment
├─ runs/                       # Training outputs (weights, logs)
├─ runs_test/                  # Examine folder independent of project
├─ src/                        # Source code
│  ├─ training/
│  │  ├─ train.py             # Training script
│  │  ├─ eval.py              # Evaluation script
│  │  └─ config.yaml          # YOLO config
│  ├─ api/
│  │  ├─ app.py               # Optional REST API for image upload
│  │  ├─ config.py            # Configuration settings
│  │  ├─ detection_service.py # Detection service logic
│  │  ├─ detection_visualizer.py # Visualization utilities
│  │  ├─ image_processor.py   # Image processing utilities
│  │  ├─ socket_handlers.py   # WebSocket handlers
│  │  ├─ live_app.py          # Flask + SocketIO for live detection
│  │  └─ model_loader.py      # YOLO model loader
│  ├─ utils/
│  │  ├─ metrics.py           # Evaluation metrics
│  │  └─ viz.py               # Visualization utilities
│  ├─ frontend/                # React frontend
│  │  ├─ package.json
│  │  └─ src/
│  │     ├─ App.tsx
│  │     └─ index.tsx
│  └─ launcher/
│     └─ launch_app.py        # WebView-based desktop launcher
├─ .dockerignore               # Docker ignore file
├─ .gitignore                  # Git ignore file
├─ compose.yaml                # Docker Compose configuration
├─ Dockerfile                  # Docker container configuration
├─ download_dataset.ps1        # PowerShell script to download dataset
├─ environment.yaml            # Conda environment specification
├─ Makefile                    # Build automation
├─ plot.py                     # Plotting utilities
├─ README.Docker.md            # Docker-specific documentation
├─ README.md                   # Main documentation
└─ yolo11n.pt                  # Pre-trained YOLO11 model weights`}
              </pre>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="border border-cyan-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Additional Resources</h2>
            <div className="space-y-3 text-gray-300">
              <p>For more detailed information, check out:</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/nee-hit476/Jenji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-300 transition"
                  >
                    GitHub Repository →
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/nee-hit476/Jenji/blob/main/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-300 transition"
                  >
                    Full README →
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/nee-hit476/Jenji/blob/main/REPORT_TEMPLATE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-300 transition"
                  >
                    Report Template →
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-gray-400 text-sm">
                This project was created for a hackathon. Check the repository for license details.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Contributions, issues, and feature requests are welcome!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}