import { useIsMenuOpen } from "@/store/isMenuOpen";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function GlobalOverlay() {
  const {
    isMenuOpen,
    toggleMenu,
    openControls,
    closeMenu,
    setShouldRestartGame,
  } = useIsMenuOpen();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleMenu, isMenuOpen]);

  return (
    <div className="fixed top-0 z-10  w-full h-full font-jersey-10 p-4 text-white">
      <button
        onClick={() => toggleMenu()}
        type="button"
        className="cursor-pointer bg-[#1A1A1A] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors duration-300"
      >
        MENU(esc)
      </button>
      {isMenuOpen && (
        <div className="relative bg-[#1A1A1A] text-white rounded-xl h-80 w-60 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
          <button
            className="absolute top-4 right-5 cursor-pointer hover:scale-125 transition-transform duration-700"
            onClick={toggleMenu}
          >
            X
          </button>
          <h1 className="text-xl">MENU</h1>
          <div className="flex flex-col gap-2 mt-10 text-lg">
            <button
              className="cursor-pointer hover:scale-120 transition-all duration-500"
              onClick={() => {
                openControls();
                closeMenu();
              }}
            >
              Controls
            </button>
            <button
              onClick={() => {
                setShouldRestartGame(true);
                closeMenu();
              }}
              className="cursor-pointer hover:scale-120 transition-all duration-500"
            >
              Restart level
            </button>
            <button
              onClick={() => {
                closeMenu();
                router.push("/");
              }}
              className="cursor-pointer hover:scale-120 transition-all duration-500"
            >
              Quit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalOverlay;
