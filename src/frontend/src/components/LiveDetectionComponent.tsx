import { useRef, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Video, Activity, Zap, ArrowLeft, AlertCircle } from "lucide-react";
import { StarsBackground } from "./[ui]/stars-background";
import { ShootingStars } from "./[ui]/shooting-stars";
import { useNavigate } from "react-router";

interface Detection {
  class_Id: number;
  class_name?: string;
  confidence: number;
}

const LiveDetectionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [devices, setDevices] = useState<Array<{ deviceId: string; label: string }>>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket:", newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionError("Failed to connect to server. Make sure the server is running on localhost:8080");
      setIsConnected(false);
    });

    newSocket.on("response_back", (data: { frame: string; detections: Detection[] }) => {
      setFrameSrc(data.frame);
      setDetections(data.detections || []);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Initialize webcam
              <button
                onClick={() => window.open(window.location.href, "_blank")}
                title="Open frontend in external browser (recommended for camera support)"
                className="text-xs text-slate-300 px-2 py-0.5 rounded bg-gray-900/20 border border-slate-700/30"
              >
                Open in Browser
              </button>
  useEffect(() => {
    let mounted = true;

    const stopStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    const startCamera = async (deviceId?: string | null) => {
      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
            : { width: { ideal: 640 }, height: { ideal: 480 } },
        };

        // Stop previous stream if any
        stopStream();

        const stream = await navigator.mediaDevices.getUserMedia(constraints as any);
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraError(null);
        }
      } catch (error) {
        console.error("Camera access error:", error);
        if (mounted) setCameraError("Unable to access camera. Please grant camera permissions or try opening the app in an external browser.");
      }
    };
    const ensurePermissionAndDevices = async () => {
      try {
        // First request a quick permission (may prompt user). We stop this stream immediately.
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true } as any);
        tempStream.getTracks().forEach((t) => t.stop());

        // Now enumeration should include device labels
        const list = await navigator.mediaDevices.enumerateDevices();
        const cams = list
          .filter((d) => d.kind === "videoinput")
          .map((d) => ({ deviceId: d.deviceId, label: d.label || `Camera ${d.deviceId}` }));
        setDevices(cams);
        // If nothing selected, pick first available
        const pick = selectedDeviceId || (cams.length > 0 ? cams[0].deviceId : null);
        setSelectedDeviceId(pick);

        // Start camera using picked device (or default)
        await startCamera(pick);
      } catch (err) {
        console.warn("Permission/enumeration flow failed:", err);
        // fallback: try to start default camera without deviceId
        try {
          await startCamera(null);
          setCameraError("Using default camera; device selection may not be supported in this environment (webview). Try external browser for multiple camera selection.");
        } catch (err2) {
          console.error("Fallback camera start failed:", err2);
          setCameraError("Unable to access any camera. Check permissions or try opening in an external browser.");
        }
      }
    };

    // Run permission+enumeration-start flow
    ensurePermissionAndDevices();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // restart camera when selected device changes
  useEffect(() => {
    // don't run on first render if selectedDeviceId is null
    if (!selectedDeviceId) return;
    const restart = async () => {
      try {
        // stop and restart with new device
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: selectedDeviceId }, width: { ideal: 640 }, height: { ideal: 480 } } } as any);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraError(null);
        }
      } catch (err) {
        console.error("Failed to switch camera:", err);
        setCameraError("Failed to switch camera. Check permissions.");
      }
    };
    restart();
  }, [selectedDeviceId]);

  // Send frames to server
  useEffect(() => {
    if (!socket || !isConnected) return;

    let frameCount = 0;
    let lastTime = Date.now();

    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !streamRef.current) return;
      
      // Check if video is ready
      if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

        try {
          // Simple backpressure: don't send a new frame if server hasn't responded
          if (awaitingResponse) return;

          ctx.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          // Reduce size / quality to lower bandwidth and inference time
          const frame = canvasRef.current.toDataURL("image/jpeg", 0.35);
          socket.emit("image", frame);
          setAwaitingResponse(true);

          frameCount++;
          const now = Date.now();
          if (now - lastTime >= 1000) {
            setFps(frameCount);
            frameCount = 0;
            lastTime = now;
          }
        } catch (error) {
          console.error("Error processing frame:", error);
        }
    }, 150);

    return () => clearInterval(interval);
  }, [socket, isConnected]);

  // release backpressure when server responds
  useEffect(() => {
    if (!socket) return;
    const handler = (data: { frame: string; detections: any[] }) => {
      setFrameSrc(data.frame);
      setDetections(data.detections || []);
      setAwaitingResponse(false);
    };
    socket.on("response_back", handler);
    return () => {
      socket.off("response_back", handler);
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-black text-white">
      <StarsBackground />
      <ShootingStars />
      {/* Error Messages */}
      {(connectionError || cameraError) && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4">
          {connectionError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-2 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-semibold text-sm mb-1">Connection Error</h4>
                  <p className="text-red-300 text-xs">{connectionError}</p>
                </div>
              </div>
            </div>
          )}
          {cameraError && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-semibold text-sm mb-1">Camera Error</h4>
                  <p className="text-yellow-300 text-xs">{cameraError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-black border-slate-700/50 relative">
        <button
          className="absolute top-3 left-3 sm:top-5 sm:left-5 text-base sm:text-xl text-gray-500 items-center hover:text-gray-300 transition-colors duration-150 cursor-pointer flex flex-row gap-2 z-10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="size-4 sm:size-5" />
          <span className="hidden sm:inline">back to home</span>
          <span className="sm:hidden">back</span>
        </button>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-black">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row items-center justify-between pt-12 sm:pt-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg">
                <img src="/jenji.png" className="h-6 w-6 sm:h-7 sm:w-7" alt="" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-white bg-clip-text text-transparent">
                  Live YOLO Detection
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real-time object recognition system
                </p>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-950/50 border border-slate-600/50">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-medium">{fps} FPS</span>
              </div>
              <div
                className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${
                  isConnected
                    ? "bg-emerald-500/10 border-emerald-500/50"
                    : "bg-red-500/10 border-red-500/50"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Original webcam feed */}
          <div className="group">
            <div className="bg-gradient-black rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30">
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-black backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-black rounded-lg">
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold">Webcam Feed</h2>
                  {/* Camera selector */}
                  <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-950/30 border border-slate-600/30">
                    <select
                      value={selectedDeviceId ?? ""}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm outline-none"
                    >
                      {devices.length === 0 ? (
                        <option value="">No cameras</option>
                      ) : (
                        devices.map((d) => (
                          <option key={d.deviceId} value={d.deviceId}>
                            {d.label}
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      onClick={async () => {
                        try {
                          const list = await navigator.mediaDevices.enumerateDevices();
                          const cams = list
                            .filter((d) => d.kind === "videoinput")
                            .map((d) => ({ deviceId: d.deviceId, label: d.label || `Camera ${d.deviceId}` }));
                          setDevices(cams);
                          if (!selectedDeviceId && cams.length > 0) setSelectedDeviceId(cams[0].deviceId);
                        } catch (err) {
                          console.warn("enumerateDevices failed:", err);
                        }
                      }}
                      className="text-xs text-slate-300 px-2 py-0.5 rounded bg-gray-900/20 border border-slate-700/30"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="p-3 sm:p-4">
                <div className="rounded-xl overflow-hidden bg-gray-950 shadow-inner border border-slate-700/30">
                  {cameraError ? (
                    <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-950">
                      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                      <span className="text-slate-500 text-sm font-medium text-center px-4">
                        Camera not available
                      </span>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      width={640}
                      height={480}
                      className="w-full h-auto"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Annotated YOLO output */}
          <div className="group">
            <div className="bg-black rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30">
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-black backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gray-950 rounded-lg">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold">YOLO Detection</h2>
                </div>
                <div className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gray-900/10 border border-blue-500/30">
                  <span className="text-xs font-medium text-blue-400">
                    {detections.length} objects
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4 relative">
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
                    <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-950">
                      <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4" />
                      <span className="text-slate-500 text-sm font-medium">
                        Waiting for video stream...
                      </span>
                    </div>
                  )}
                </div>

                {/* Detections overlay */}
                {detections.length > 0 && (
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-slate-900/95 backdrop-blur-md rounded-lg sm:rounded-xl shadow-2xl border border-slate-700/50 max-h-[300px] sm:max-h-[400px] overflow-hidden max-w-[calc(100%-2rem)] sm:max-w-none">
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border-b border-slate-700/50">
                      <h3 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                        <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                        Detections
                      </h3>
                    </div>
                    <div className="max-h-[240px] sm:max-h-[340px] overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 custom-scrollbar">
                      {detections.map((det, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-cyan-500/30 transition-colors"
                        >
                          <span className="text-xs sm:text-sm font-medium text-slate-300">
                            {det.class_name ?? `Class ${det.class_Id}`}
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-12 sm:w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${det.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-cyan-400 min-w-[2.5rem] sm:min-w-[3rem] text-right">
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

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "none" }}
      />

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

export default LiveDetectionComponent;