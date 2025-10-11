import { useState } from "react";
import TwitterIcon from "./icons/TwitterIcon";
import { Menu } from "lucide-react";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans p-5 relative overflow-hidden">
      <div className="navbar flex items-center justify-between md:justify-start w-full flex-wrap">
        {/* Left: Logo + Title */}
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
        <div className="navigator hidden md:flex flex-row gap-3 items-center text-sm ml-20">
          {["Detection", "Live", "Documentation", "Scores"].map((navigation) => (
            <span
              key={navigation}
              className="text-gray-50/50 hover:text-white transition-colors duration-150"
            >
              {navigation}
            </span>
          ))}
          <span className="text-gray-50/50 ml-100 hover:text-white transition-colors duration-150">
            Github
          </span>
        </div>

        {/* Right: Twitter */}
        <div className="flex items-center justify-end">
          <button>
            <TwitterIcon />
          </button>
        </div>

        {/* Hamburger (only mobile) */}
        <div className="md:hidden" onClick={() => setMenuOpen(true)}>
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
