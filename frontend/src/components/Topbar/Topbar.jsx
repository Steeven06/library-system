import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Topbar({ setIsOpen }) {
  return (
    <header className="h-16 bg-white px-4 sm:px-6 flex items-center justify-between shadow-sm">

      {/* IZQUIERDA - LOGO + HAMBURGER */}
      <div className="flex items-center gap-3">
        {/* Botón de menú solo en móvil */}
        <Bars3Icon
          className="w-7 h-7 text-gray-700 cursor-pointer md:hidden"
          onClick={() => setIsOpen(true)}
        />

        {/* Título */}
        <h2 className="text-lg sm:text-4xl font-semibold whitespace-nowrap">
          Panel de administración
        </h2>
      </div>

      {/* DERECHA - PERFIL */}
      <div className=" flex items-center gap-3">
        <span className="  hidden sm:block text-gray-600 text-2xl whitespace-nowrap">
          Hola, Bienvenido 👋
        </span>

      
      </div>

    </header>
  );
}

