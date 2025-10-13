import { useState } from "react";
import { ShootingStars } from "./[ui]/shooting-stars";
import { StarsBackground } from "./[ui]/stars-background";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const ImageDetectionComponent = () => {
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  // const [loading, setloading] = useState<boolean>(false);
  // const [error, setError] = useState<boolean>(false);

  console.log(setSocketConnected);

  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-black font-sans p-5">
      <StarsBackground />
      <ShootingStars />
      <button
        className="absolute text-xl text-gray-500 items-center hover:text-gray-300 transition-colors duration-150 cursor-pointer flex flex-row gap-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="size-5" />
        <span>back to home</span>
      </button>
      <div className="z-10 w-full flex flex-row justify-around">
        <div className="w-[100%] pl-20">
          <h1 className="text-white font-semibold  text-5xl font-sans text-center ">
            Image Object Detection
          </h1>
          <div className="text-gray-500 text-2xl text-center w-full p-4">
            Upload an image to detect objects
          </div>
        </div>
        <div className={`text-white flex flex-row items-center gap-2 border-1 h-max bg-gray-500/40 px-4 pt-2 rounded-2xl p-2 ${socketConnected ? "bg-emerald-200 border-emerald-400" : "bg-red-200/20 border-red-400"}`}>
            <div
                  className={`w-2 h-2 rounded-full ${
                    socketConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                  }`}
                />
            <span className="">
            {socketConnected ? "Connected" : "Disconnected"}
            </span>
        </div>
        
      </div>
    </div>
  );
};

export default ImageDetectionComponent;
