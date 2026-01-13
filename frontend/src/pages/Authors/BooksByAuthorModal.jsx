import React, { useEffect } from "react";
import { BookOpenIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function BooksByAuthorModal({ isOpen, onClose, author, books }) {
  if (!isOpen) return null;

  const authorBooks = (books || []).filter(
    (b) =>
      (b.authorFullName || "").toLowerCase() ===
      (author?.fullName || "").toLowerCase()
  );

  // 🔹 Cerrar con ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // 🔹 Click fuera del modal
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 animate-fadeIn"
        onMouseDown={(e) => e.stopPropagation()} // evita cierre al hacer click dentro
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Libros del autor
            </h2>
            <p className="text-base text-gray-600 mt-1">
              {author?.fullName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Cerrar"
          >
            <XMarkIcon className="w-6 text-gray-600" />
          </button>
        </div>

        {/* Contenido */}
        {authorBooks.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Este autor no tiene libros registrados.
          </div>
        ) : (
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
            {authorBooks.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <BookOpenIcon className="w-6 text-blue-600 flex-shrink-0" />

                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {b.title}
                  </p>
                  <p className="text-base text-gray-600">
                    {b.categoryName} {b.year ? `· ${b.year}` : ""}
                  </p>
                </div>

                <span className="ml-auto text-sm px-2 py-1 rounded-full bg-white border text-gray-700">
                  {b.quantity}/{b.availableQuantity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
