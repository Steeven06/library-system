import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [openBooks, setOpenBooks] = useState(true);

  return (
    <>
      {/* OVERLAY PARA MÓVIL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full w-64 bg-white shadow-lg
          transform transition-transform duration-300 z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Cerrar en móvil */}
        <div className="md:hidden flex justify-end p-4">
          <XMarkIcon
            className="w-7 cursor-pointer text-gray-600"
            onClick={() => setIsOpen(false)}
          />
        </div>

        <h1 className="text-4xl font-extrabold mb-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Biblioteca
        </h1>

        <nav className="flex flex-col gap-1 px-4">

          {/* PANEL */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-all
            ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-blue-50 text-gray-700"
            }`
            }
          >
            <HomeIcon className="w-5" />
            Panel
          </NavLink>

          {/* LIBROS DESPLEGABLE */}
          <div>
            <button
              onClick={() => setOpenBooks(!openBooks)}
              className="flex items-center justify-between w-full px-3 py-2 text-lg font-medium text-gray-700 rounded-lg hover:bg-blue-50"
            >
              <span className="flex items-center gap-3">
                <BookOpenIcon className="w-5" />
                Libros
              </span>

              {openBooks ? (
                <ChevronDownIcon className="w-4" />
              ) : (
                <ChevronRightIcon className="w-4" />
              )}
            </button>

            {openBooks && (
              <div className="ml-9 mt-1 flex flex-col gap-1">

                <NavLink
                  to="/books"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded-md text-sm transition-all
                      ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700 hover:text-blue-600"
                      }`
                  }
                >
                  Lista Libros
                </NavLink>

                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded-md text-sm transition-all
                      ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700 hover:text-blue-600"
                      }`
                  }
                >
                  Categorías
                </NavLink>

                <NavLink
                  to="/authors"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded-md text-sm transition-all
                      ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700 hover:text-blue-600"
                      }`
                  }
                >
                  Autores
                </NavLink>

              </div>
            )}
          </div>

          {/* USUARIOS */}
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-blue-50 text-gray-700"
              }`
            }
          >
            <UsersIcon className="w-5" />
            Usuarios
          </NavLink>

          {/* PRÉSTAMOS */}
          <NavLink
            to="/loans"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-blue-50 text-gray-700"
              }`
            }
          >
            <ClipboardDocumentListIcon className="w-5" />
            Préstamos
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
