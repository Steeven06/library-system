import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import Topbar from "../components/Topbar/Topbar.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:block">
        <Sidebar isOpen={true} setIsOpen={setIsOpen} />
      </div>

      {/* SIDEBAR MOBILE */}
      <div className="md:hidden">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* OVERLAY OSCURO + BLUR */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed inset-0 
            bg-black/40 
            backdrop-blur-sm 
            z-20 
            md:hidden
            transition-opacity
          "
        />
      )}

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col relative z-10">
        <Topbar setIsOpen={setIsOpen} />

        <main className="flex-1 px-3 py-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
