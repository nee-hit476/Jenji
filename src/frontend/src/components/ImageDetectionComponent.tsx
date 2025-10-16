import { useState, useEffect } from "react";
import { ShootingStars } from "./[ui]/shooting-stars";
import { StarsBackground } from "./[ui]/stars-background";
import { useNavigate } from "react-router";
import { ArrowLeft, Zap, Activity } from "lucide-react";
import FileUpload from "./[ui]/FileUpload";
import { io, type Socket } from "socket.io-client";

interface Detection {
  class_Id: number;
  confidence: number;
  bbox?: number[];
}

interface ProcessedImage {
  id: string;
  originalFile: File;
  processedFrame: string;
  detections: Detection[];
  timestamp: number;
}

const ImageDetectionComponent = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket:", newSocket.id);
      setSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setSocketConnected(false);
    });

    newSocket.on("response_back", (data: { frame: string; detections: Detection[] }) => {
      console.log("Received detection result:", data);
      setIsProcessing(false);
      
      // Add the processed image to the results
      setProcessedImages((prev) => {
        const newImage: ProcessedImage = {
          id: `processed-${Date.now()}-${Math.random()}`,
          originalFile: new File([], "processed"), // Placeholder
          processedFrame: data.frame,
          detections: data.detections,
          timestamp: Date.now(),
        };
        return [...prev, newImage].slice(-3); // Keep only last 3
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleFilesSelected = (files: File[]) => {
    if (!socket || !socketConnected) {
      console.error("WebSocket not connected");
      return;
    }

    // Clear previous results
    setProcessedImages([]);
    setIsProcessing(true);

    // Process each file
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        console.log(`Sending image ${index + 1} to server`);
        socket.emit("image", base64Image);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen w-full bg-black font-sans p-3 sm:p-5 overflow-x-hidden">
      <StarsBackground />
      <ShootingStars />
      
      <button
        className="absolute top-3 left-3 sm:top-5 sm:left-5 text-base sm:text-xl text-gray-500 items-center hover:text-gray-300 transition-colors duration-150 cursor-pointer flex flex-row gap-2 z-50"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="size-4 sm:size-5" />
        <span className="hidden sm:inline">back to home</span>
        <span className="sm:hidden">back</span>
      </button>

      <div className="relative z-10 w-full pt-16 sm:pt-8 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl font-sans">
                Image Object Detection
              </h1>
              <p className="text-gray-500 text-base sm:text-xl lg:text-2xl mt-2 sm:mt-4">
                Upload up to 3 images to detect objects
              </p>
            </div>
            
            <div
              className={`text-white flex flex-row items-center gap-2 border-1 h-max px-3 sm:px-4 py-2 rounded-2xl whitespace-nowrap ${
                socketConnected
                  ? "bg-emerald-500/20 border-emerald-400"
                  : "bg-red-500/20 border-red-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  socketConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              <span className="text-sm sm:text-base">{socketConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-8 pb-8">
        {/* File Upload Section */}
        <div className="flex justify-center">
          <FileUpload onFilesSelected={handleFilesSelected} maxFiles={3} />
        </div>

        {/* Processing Indicator */}
        {isProcessing && processedImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-base sm:text-lg">Processing images...</p>
          </div>
        )}

        {/* Results Preview Section */}
        {processedImages.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                <Zap className="text-blue-400" size={24} />
                <span>Detection Results</span>
              </h2>
              <button
                onClick={() => setProcessedImages([])}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200 border border-gray-700/50"
              >
                Clear Results
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative bg-gray-900/40 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-gray-950">
                    <img
                      src={image.processedFrame}
                      alt={`Detection result ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Overlay badge */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-blue-500/90 backdrop-blur-sm border border-blue-400/50 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-white" />
                      <span className="text-xs font-semibold text-white">
                        {image.detections.length} objects
                      </span>
                    </div>
                  </div>

                  {/* Detections List */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      Detected Objects
                    </h3>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {image.detections.length > 0 ? (
                        image.detections.map((det, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/30"
                          >
                            <span className="text-sm font-medium text-gray-300">
                              Class {det.class_Id}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
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
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">
                          No objects detected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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

export default ImageDetectionComponent;