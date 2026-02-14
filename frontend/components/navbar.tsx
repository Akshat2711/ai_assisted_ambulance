"use client";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-5 bg-zinc-950/20 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Title only */}
        <div className="cursor-pointer">
          <span className="font-mono text-xl md:text-2xl font-bold tracking-[0.25em] text-white uppercase">
            MED.OS
          </span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
