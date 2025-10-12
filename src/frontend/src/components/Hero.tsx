import { AnimatedPinDemo } from "./3dPin";
import Button from "./[ui]/Button";
import { ShootingStars } from "./[ui]/shooting-stars";
import { StarsBackground } from "./[ui]/stars-background";
import TrueFocus from "./[ui]/TrueFocus";
import { DottedGlowBackgroundDemo } from "./dotted-glow-card";

const Hero = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <StarsBackground />
      <ShootingStars />
      {/* Main content area with flex */}
      <div className="flex flex-col w-full md:flex-row gap-3 text-white font-sans pt-25 justify-start md:px-50">
        {/* Left: Focused logo word */}
        <div className="text-6xl font-extrabold leading-tight flex flex-wrap items-center pl-10  md:justify-start md:w-150 h-5 mr-15">
          <TrueFocus
            sentence="Jenji AI"
            manualMode={false}
            blurAmount={5}
            borderColor="red"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
          <span className="text-4xl md:text-6xl">
            enables Real-Time Object Detection for Space Stations
          </span>
          <div className="text-xl font-semibold">
            
            <div className="text-gray-400 mt-5">
                <span>Detect 7 critical space station safety objects under varying conditions. With absolute precision values map@5.0</span>
            </div>
            
          <Button label="Get Started"/>
          </div>
        </div>
        <div className="flex flex-col items-center md:flex-row">
          <div className="w-[2px] h-[500px] hidden md:flex mr-15 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
          <div className="hidden md:flex">
          <DottedGlowBackgroundDemo />
          <AnimatedPinDemo/></div>
          <div className="w-[2px] h-[500px] bg-gradient-to-b hidden md:flex from-transparent via-gray-600 to-transparent"></div>
        </div>
      </div>
      

      {/* Decorative icons layer - behind main content */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Right - Rotating */}
        <img
          src="/oxygen3.png"
          alt=""
          className="absolute bottom-50 md:bottom-30 right-4 md:right-10 h-24 md:h-40 transform rotate-25 animate-bounce opacity-70"
          style={{ animationDuration: "5s" }}
        />

        {/* Top Left - Floating */}
        <img
          src="/aid.png"
          alt=""
          className="absolute bottom-60 md:bottom-80 left-4 md:left-15 h-28 md:h-42 transform -rotate-12 animate-bounce opacity-70"
          style={{ animationDuration: "5s" }}
        />

        <img
          src="/nitrogen.png"
          alt=""
          className="absolute bottom-30 left-20 md:left-40 h-20 md:h-32 transform -rotate-12 animate-bounce opacity-70"
          style={{ animationDuration: "5s" }}
        />

        {/* Bottom Left - Tilted */}
        <img
          src="/firealarm.png"
          alt=""
          className="absolute bottom-10 md:bottom-20 left-2 md:left-10 h-20 md:h-30 animate-bounce transform rotate-12 opacity-70"
          style={{ animationDuration: "5s" }}
        />

        {/* Bottom Right - Floating */}
        <img
          src="/man.png"
          alt=""
          className="absolute bottom-5 md:bottom-10 right-10 md:right-60 h-32 md:h-50 transform -rotate-10 animate-bounce opacity-70"
          style={{ animationDuration: "5s" }}
        />

        {/* Middle Right - Small accent */}
        <img
          src="/emergency phone.png"
          alt=""
          className="absolute bottom-80 right-2 md:right-10 h-20 md:h-40 transform -rotate-40 animate-bounce opacity-70"
          style={{ animationDuration: "5s" }}
        />
      </div>
    </div>
  );
};

export default Hero;
