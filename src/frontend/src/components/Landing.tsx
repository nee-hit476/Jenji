import { useState } from "react";
import TwitterIcon from "./icons/TwitterIcon";
import { Menu } from "lucide-react";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const navigations = [
    {name: "Dectection", link: "/jenji/predict/upload"},
    {name: "Live", link: "/jenji/live"},
    {name: "Documentation", link: "/jenji/predict/upload"},
    {name: "Scores", link: "/jenji/predict/upload"},

  ]

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans">
      <div className="w-full h-12 bg-blue-600 text-sm brightness-120 flex justify-center items-center font-sans p-2 md:p-0 md:font-semibold">
        <span className="drop-shadow-2xl">
          Introducing GenIginite hackathon{" "}
          <span className="font-bold">JENJI AI</span> : Space Station Safety
          Object Detection
        </span>
      </div>
      <div className="navbar flex items-center justify-between w-full flex-wrap">
        {/* Left: Logo + Title */}
        <div className="flex flex-row gap-10  p-4 relative overflow-hidden md:px-10">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/jenji.png"
              alt="Jenji Logo"
              className="h-5 border-[0.5px] rounded-[2px] border-gray-200/50 drop-shadow-2xl"
            />
            <span className="text-white font-sans font-semibold text-base md:text-xl whitespace-nowrap">
              Jenji Ai
            </span>
          </div>

          {/* Navigator */}
          <div className="navigator hidden md:flex flex-row gap-3 items-center text-sm ml-30">
            {navigations.map(
              (navigation, index) => (
                <a href={navigation.link}>
                <span
                  key={index}
                  className="text-gray-50/50 font-semibold hover:text-white transition-colors duration-150"
                >
                  {navigation.name}
                </span>
                </a>
              )
            )}
          </div>
        </div>

        <div className="hidden md:flex">
          <div>
            <a href="https://github.com/nee-hit476/Jenji" target="_blank">
            <span className="text-gray-50/50 ml-100 font-semibold hover:text-white transition-colors duration-150">
              Github
            </span>
            </a>
          </div>
          
        </div>

            <div className="absolute hidden md:block right-2">
              <button className="flex relative justify-start items-center text-sm text-muted-foreground border-white/[0.2] py-2 w-fit border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-4 rounded-xl bg-brand">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-4 w-4 text-neutral-500"
            >
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
              <path d="M21 21l-6 -6"></path>
            </svg>
            <span className="transition-colors text-gray-50/50 hover:text-white rex text-xs  duration-150 sm:text-sm font-medium pl-2 pr-4">
              Search <span className="hidden xl:inline-block">Components</span>
            </span>
            <kbd className="pointer-events-none text-gray-50/50 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
            </div>

        {/* Right: Twitter */}
        <div className="flex items-center justify-end">
          <button>
            <TwitterIcon />
          </button>
        </div>

        {/* Hamburger (only mobile) */}
        <div className="md:hidden mr-2" onClick={() => setMenuOpen(true)}>
          <Menu />
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="load-menu absolute top-0 left-0 w-full bg-black p-5 flex flex-col items-center gap-4 text-sm z-50">
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-gray-50/50 hover:text-white mb-2"
            >
              ✕
            </button>
            {["Detection", "Live", "Documentation", "Scores", "Github"].map(
              (item) => (
                <span
                  key={item}
                  className="text-xl text-gray-50/70 hover:text-white transition-colors duration-150"
                >
                  {item}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
