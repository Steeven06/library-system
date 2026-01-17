import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [openBooks, setOpenBooks] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  return (
    <>
      {/* Overlay con fade más suave */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] md:hidden z-20 
                     transition-opacity duration-500 ease-in-out"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar con animación mejorada */}
      <aside
        className={`
          fixed md:sticky md:top-0
          inset-y-0 left-0 z-30
          w-72 md:w-72 lg:w-80
          
          min-h-screen flex flex-col
          
          bg-gradient-to-br from-gray-50/95 via-white/95 to-gray-100/90
          backdrop-blur-lg
          border-r border-gray-200/70
          shadow-2xl shadow-gray-900/10
          
          transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          will-change-transform
          
          ${isOpen 
            ? "translate-x-0 opacity-100" 
            : "-translate-x-full opacity-0 md:opacity-100"}
          md:translate-x-0 md:opacity-100
        `}
      >
        {/* Botón cerrar con rotación suave */}
        <div className="md:hidden flex justify-end p-5">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2.5 hover:bg-gray-200/70 active:scale-95
                       transition-all duration-300 ease-out"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-7 w-7 text-gray-700 transition-transform duration-300 hover:rotate-90" />
          </button>
        </div>

        {/* Logo con entrada suave */}
        <div className="px-6 pt-8 pb-12 md:pt-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight 
                         bg-gradient-to-r from-indigo-500 via-blue-600 to-violet-600 
                         bg-clip-text text-transparent
                         transition-all duration-700 ease-out
                         group-hover:scale-[1.02]">
            Biblioteca
          </h1>
        </div>

        {/* Navegación con stagger sutil */}
        <nav className="px-4 space-y-1.5 flex-1">
          {/* Item genérico con efecto glass + lift */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium
               transition-all duration-400 ease-out
               before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-indigo-500/0 before:via-white/0 before:to-blue-500/0
               before:transition-opacity before:duration-500
               ${isActive
                 ? "bg-gradient-to-r from-indigo-600/90 to-blue-600/90 text-white shadow-xl shadow-indigo-500/30 ring-1 ring-indigo-400/40 scale-[1.02]"
                 : "text-gray-700 hover:bg-white/70 hover:shadow-lg hover:shadow-indigo-200/40 hover:text-indigo-700 hover:scale-[1.015] hover:ring-1 hover:ring-indigo-200/50"
               } hover:before:opacity-10`
            }
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:text-indigo-500" />
            Panel
          </NavLink>

          {/* LIBROS - desplegable mejorado */}
          <div>
            <button
              onClick={() => setOpenBooks(!openBooks)}
              className={`
                group flex w-full items-center justify-between px-5 py-3.5 rounded-2xl text-[15px] font-medium text-gray-700
                transition-all duration-400 ease-out
                hover:bg-white/70 hover:shadow-lg hover:shadow-indigo-200/30 hover:text-indigo-700 hover:scale-[1.015]
              `}
            >
              <div className="flex items-center gap-4">
                <BookOpenIcon className="h-5 w-5 flex-shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:text-indigo-500" />
                Libros
              </div>
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
                           ${openBooks ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
              />
            </button>

            {/* Submenú con animación de altura + fade + stagger */}
            <div
              className={`
                grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${openBooks 
                  ? "grid-rows-[1fr] opacity-100 mt-2" 
                  : "grid-rows-[0fr] opacity-0 mt-0"}
              `}
            >
              <div className="overflow-hidden">
                <div className="ml-11 space-y-1.5 pl-2 border-l border-indigo-200/40">
                  {[
                    { to: "/books", label: "Lista Libros" },
                    { to: "/categories", label: "Categorías" },
                    { to: "/authors", label: "Autores" },
                  ].map((item, i) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-xl text-sm font-medium
                         transition-all duration-300 ease-out
                         translate-y-2 opacity-0
                         ${openBooks ? "translate-y-0 opacity-100" : ""}
                         delay-${i * 100}
                         ${isActive
                           ? "bg-indigo-100/70 text-indigo-800 font-semibold shadow-sm ring-1 ring-indigo-300/50 scale-[1.02]"
                           : "text-gray-600 hover:text-indigo-700 hover:bg-indigo-50/60 hover:scale-[1.02]"
                         }`
                      }
                      style={{
                        transitionDelay: openBooks ? `${i * 80}ms` : "0ms",
                      }}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Otros items con el mismo estilo mejorado */}
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium
               transition-all duration-400 ease-out
               ${isActive
                 ? "bg-gradient-to-r from-indigo-600/90 to-blue-600/90 text-white shadow-xl shadow-indigo-500/30 ring-1 ring-indigo-400/40 scale-[1.02]"
                 : "text-gray-700 hover:bg-white/70 hover:shadow-lg hover:shadow-indigo-200/40 hover:text-indigo-700 hover:scale-[1.015]"
               }`
            }
          >
            <UsersIcon className="h-5 w-5 flex-shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:text-indigo-500" />
            Usuarios
          </NavLink>

          <NavLink
            to="/loans"
            className={({ isActive }) =>
              `group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium
               transition-all duration-400 ease-out
               ${isActive
                 ? "bg-gradient-to-r from-indigo-600/90 to-blue-600/90 text-white shadow-xl shadow-indigo-500/30 ring-1 ring-indigo-400/40 scale-[1.02]"
                 : "text-gray-700 hover:bg-white/70 hover:shadow-lg hover:shadow-indigo-200/40 hover:text-indigo-700 hover:scale-[1.015]"
               }`
            }
          >
            <ClipboardDocumentListIcon className="h-5 w-5 flex-shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:text-indigo-500" />
            Préstamos
          </NavLink>
        </nav>
      </aside>
    </>
  );
}