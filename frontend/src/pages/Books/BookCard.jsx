import { FiEdit, FiTrash, FiBookOpen } from "react-icons/fi";
import React, { useEffect, useState } from "react";

export default function BookCard({ book, onEdit, onDelete }) {
  const getAvailabilityColor = (value) => {
    if (value === 0) return "bg-red-100 text-red-700";
    if (value <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const initialHasImage = !!(book.imageUrl && book.imageUrl.trim() !== "");
  const [showImage, setShowImage] = useState(initialHasImage);

  // ✅ Si editas el libro y cambias imageUrl, actualiza showImage automáticamente
  useEffect(() => {
    const hasImage = !!(book.imageUrl && book.imageUrl.trim() !== "");
    setShowImage(hasImage);
  }, [book.imageUrl]);

  return (
    <div
      className="
        bg-white shadow-md rounded-xl overflow-hidden relative group
        transform transition-all duration-300
        hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]
      "
    >
      {/* Imagen / Placeholder */}
      <div className="relative w-full aspect-[4/4] overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            key={book.imageUrl} // ✅ fuerza refresh si cambia el src
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-contain bg-white transition-transform duration-300 group-hover:scale-105"
            onError={() => setShowImage(false)}
          />
        ) : (
          <div
            className="
              w-full h-full flex flex-col items-center justify-center
              bg-gradient-to-br from-blue-500 to-purple-600 text-white
            "
          >
            <FiBookOpen size={48} className="mb-2 opacity-90" />
            <span className="text-base font-medium text-center px-4">
              Sin portada
            </span>
          </div>
        )}

        {/* Tooltip en hover */}
        <div
          className="
            absolute inset-0 bg-black/60 text-white text-lg p-3 opacity-0
            group-hover:opacity-100 transition-all duration-300
            flex items-center justify-center text-center backdrop-blur-sm
          "
        >
          {book.description || "Sin descripción"}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-xl text-gray-800 truncate">{book.title}</h3>
        <p className="text-gray-600 text-base truncate">{book.authorFullName}</p>

        <p className="text-gray-500 text-base mt-1">
          Año: <span className="font-medium">{book.year}</span>
        </p>

        <p className="text-gray-500 text-base mt-1 truncate">{book.categoryName}</p>

        {/* Disponibilidad */}
        <div className="flex gap-2 mt-3">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-base rounded">
            Total: {book.quantity}
          </span>

          <span
            className={`px-2 py-0.5 text-base rounded ${getAvailabilityColor(
              book.availableQuantity
            )}`}
          >
            Disponibles: {book.availableQuantity}
          </span>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => onEdit(book)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <FiEdit /> Editar
          </button>

          <button
            onClick={() => onDelete(book)}
            className="flex items-center gap-1 text-red-600 hover:text-red-800"
          >
            <FiTrash /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
