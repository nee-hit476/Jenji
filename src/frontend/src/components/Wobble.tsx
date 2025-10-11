"use client";

import { WobbleCard } from "./[ui]/wobble-card"; 

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      {/* Card 1 — Core Vision */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-blue-950 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Real-Time Object Detection for Space Safety
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            Jenji AI ensures astronaut safety by detecting critical onboard
            equipment in real time using YOLOv11. It helps identify oxygen
            tanks, fire alarms, first aid kits, and more — instantly.
          </p>
        </div>
        <img
          src="/station-detection.png"
          width={500}
          height={500}
          alt="YOLO detection demo"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

      {/* Card 2 — Tech Stack */}
      <WobbleCard containerClassName="col-span-1 bg-indigo-800 min-h-[300px]">
        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Powered by YOLOv11, Flask & React
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          Jenji combines deep learning with live streaming through
          Flask-SocketIO and React to deliver accurate, low-latency detections
          for space mission control systems.
        </p>
      </WobbleCard>

      {/* Card 3 — Goal / Impact */}
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-pink-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Making Space Stations Safer — One Detection at a Time
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Built during the Microsoft Hackathon, Jenji demonstrates how
            computer vision can proactively identify safety-critical equipment,
            empowering astronauts to respond faster during emergencies.
          </p>
        </div>
        <img
          src="/space-safety.png"
          width={500}
          height={500}
          alt="Safety monitoring visualization"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
