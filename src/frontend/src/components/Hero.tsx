import TrueFocus from "./[ui]/TrueFocus";

const Hero = () => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Main content area with flex */}
            <div className="flex flex-col pt-20 justify-start min-h-screen relative z-10">
                <TrueFocus
                    sentence="JenJI AI"
                    manualMode={false}
                    blurAmount={5}
                    borderColor="red"
                    animationDuration={2}
                    pauseBetweenAnimations={1}
                />
                {/* Add more content here - it will be centered and above the icons */}
            </div>

            {/* Decorative icons layer - behind main content */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Right - Rotating */}
                <img
                    src="/oxygen3.png"
                    alt=""
                    className="absolute bottom-50 md:bottom-30 right-4 md:right-10 h-24 md:h-40 transform rotate-45 animate-bounce opacity-70"
                    style={{ animationDuration: '5s' }}
                />

                {/* Top Left - Floating */}
                <img
                    src="/aid.png"
                    alt=""
                    className="absolute bottom-60 md:bottom-80 left-4 md:left-20 h-28 md:h-42 transform -rotate-12 animate-bounce opacity-70"
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
                    style={{ animationDuration: '5s' }}
                />

                {/* Middle Right - Small accent */}
                <img
                    src="/emergency phone.png"
                    alt=""
                    className="absolute top-1/3 right-2 md:right-10 h-20 md:h-30 transform -rotate-40 animate-bounce opacity-70"
                    style={{ animationDuration: '5s' }}
                />
            </div>
        </div>
    );
};

export default Hero;