import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Database, Cpu, Play } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-black">
      
    
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-5xl font-bold text-white mb-6">Documentation</h1>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Complete setup and usage guide for Jenji.
          </p>

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
                  <code className="text-cyan-400 text-sm">
                    git clone https://github.com/nee-hit476/Jenji.git<br />
                    cd Jenji
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Set up Python Environment</h3>
                <p className="text-gray-300 mb-3">Using conda:</p>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600">
                  <code className="text-cyan-400 text-sm">
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
                  <code className="text-cyan-400 text-sm">
                    run download_dataset.ps1
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Training */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
              <Cpu className="w-8 h-8 text-cyan-400" />
              <span>Model Training</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Train YOLO Model</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-cyan-400 text-sm">
                    python train.py --cfg config.yaml --data ../dataset/data.yaml --epochs 50 --batch-size 16
                  </code>
                </div>
                <p className="text-gray-300">Outputs:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 mt-2">
                  <li>Trained weights in runs/yolov11_experiment_x/weights/</li>
                  <li>Logs and metrics in runs/yolov11_experiment_x/</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Evaluate Model Performance</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-cyan-400 text-sm">
                    python eval.py --weights ../runs/yolov11_experiment_x/weights/best.pt --data ../dataset/data.yaml
                  </code>
                </div>
                <p className="text-gray-300">Generates:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 mt-2">
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
                <h3 className="text-xl font-semibold text-white mb-3">Start Flask-SocketIO Backend</h3>
                <div className="bg-gray-900/60 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-cyan-400 text-sm">
                    cd src<br />
                    python launcher/launch_app.py
                  </code>
                </div>
                <p className="text-gray-300">This will:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 mt-2">
                  <li>Open WebView desktop window pointing to frontend</li>
                  <li>Stream webcam frames to Flask server</li>
                  <li>Return annotated frames in real-time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Frontend Setup (React)</h3>
                <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600 mb-3">
                  <code className="text-cyan-400 text-sm">
                    cd src/frontend<br />
                    npm install<br />
                    npm run dev
                  </code>
                </div>
                <p className="text-gray-300 mt-3">
                  Ensure the frontend dev server is running on http://localhost:5173
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Using the App</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                  <li>Allow camera permissions when prompted</li>
                  <li>Wait for the live feed to initialize</li>
                  <li>YOLO will detect objects and overlay bounding boxes</li>
                  <li>Green boxes indicate detected objects with class name and confidence</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Project Structure */}
          <div className="bg-black backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
              <Database className="w-8 h-8 text-cyan-400" />
              <span>Project Structure</span>
            </h2>
            <div className="bg-gray-900/30 rounded-lg p-4 border border-slate-600">
              <pre className="text-cyan-400 text-sm overflow-x-auto">
{`Jenji/
├─ dataset/
│  └─ data.yaml
├─ src/
│  ├─ training/
│  │  ├─ train.py
│  │  ├─ eval.py
│  │  └─ config.yaml
│  ├─ api/
│  │  ├─ app.py
│  │  ├─ live_app.py
│  │  └─ model_loader.py
│  ├─ utils/
│  │  ├─ metrics.py
│  │  └─ viz.py
│  ├─ frontend/
│  │  ├─ package.json
│  │  └─ src/
│  │     ├─ App.tsx
│  │     └─ index.tsx
│  └─ launcher/
│     └─ launch_app.py
├─ runs/
├─ environment.yml
├─ Dockerfile
└─ docker-compose.yml`}
              </pre>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Additional Resources</h2>
            <div className="space-y-3 text-gray-300">
              <p>For more detailed information, check out:</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/nee-hit476/Jenji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition"
                  >
                    GitHub Repository →
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/nee-hit476/Jenji/blob/main/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Full README →
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/nee-hit476/Jenji/blob/main/REPORT_TEMPLATE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Report Template →
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
