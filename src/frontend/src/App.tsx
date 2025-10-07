import React, { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Video, Activity, Zap, Eye } from "lucide-react";

const LiveDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const newSocket = io("http://localhost:8080", { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("response_back", (data) => {
      setFrameSrc(data.frame);
      setDetections(data.detections);
    });

    return () => {newSocket.disconnect()};
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    let frameCount = 0;
    let lastTime = Date.now();

    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const frame = canvasRef.current.toDataURL("image/jpeg", 0.5);
      socket.emit("image", frame);

      frameCount++;
      const now = Date.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
    }, 150);

    return () => clearInterval(interval);
  }, [socket]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Live YOLO Detection
                </h1>
                <p className="text-sm text-slate-400">Real-time object recognition system</p>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/50">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">{fps} FPS</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                isConnected
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : 'bg-red-500/10 border-red-500/50'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original webcam feed */}
          <div className="group">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30">
              <div className="px-6 py-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Video className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-lg font-semibold">Webcam Feed</h2>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="p-4">
                <div className="rounded-xl overflow-hidden bg-slate-950 shadow-inner border border-slate-700/30">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width={640}
                    height={480}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Annotated YOLO output */}
          <div className="group">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30">
              <div className="px-6 py-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold">YOLO Detection</h2>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
                  <span className="text-xs font-medium text-blue-400">{detections.length} objects</span>
                </div>
              </div>
              <div className="p-4 relative">
                <div className="rounded-xl overflow-hidden bg-slate-950 shadow-inner border border-slate-700/30">
                  {frameSrc ? (
                    <img
                      src={frameSrc}
                      alt="YOLO Output"
                      width={640}
                      height={480}
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="w-full aspect-video flex flex-col items-center justify-center bg-slate-950">
                      <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4" />
                      <span className="text-slate-500 text-sm font-medium">Waiting for video stream...</span>
                    </div>
                  )}
                </div>

                {/* Detections overlay */}
                {detections.length > 0 && (
                  <div className="absolute top-8 right-8 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 max-h-[400px] overflow-hidden">
                    <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        Detections
                      </h3>
                    </div>
                    <div className="max-h-[340px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                      {detections.map((det, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-cyan-500/30 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-300">
                            Class {det.class_Id}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${det.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-cyan-400 min-w-[3rem] text-right">
                              {(det.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
      `}</style>
    </div>
  );
};

export default LiveDetection;
