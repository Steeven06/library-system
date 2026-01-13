import React from "react";
import { FiEdit2, FiTrash2, FiTag, FiLock } from "react-icons/fi";

function badgeClasses(count) {
  if (count === 0) return "bg-gray-100 text-gray-700 border-gray-200";
  if (count <= 2) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-purple-50 text-purple-700 border-purple-200";
}

export default function CategoryRow({
  cat = { name: "" },
  booksCount = 0,
  onEdit = () => {},
  onDelete = () => {},
} = {}) {
  const canDelete = booksCount === 0;

  return (
    <div className="px-4 sm:px-5 py-3">
      <div
        className="
          flex items-center justify-between gap-3
          rounded-2xl border border-gray-100 bg-white
          px-4 py-3 shadow-sm
          hover:shadow-md hover:border-gray-200 transition
        "
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
            <FiTag />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900 truncate">{cat.name}</p>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] border ${badgeClasses(
                  booksCount
                )}`}
                title={`${booksCount} libro(s) en esta categoría`}
              >
                {booksCount} libro(s)
              </span>

              {!canDelete && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] border bg-gray-50 text-gray-500 border-gray-200"
                  title="No se puede eliminar porque tiene libros asignados"
                >
                  <FiLock /> No eliminable
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-0.5">
              {canDelete
                ? "Sin libros asignados"
                : "Tiene libros asignados"}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(cat)}
            className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
            title="Editar"
          >
            <FiEdit2 />
          </button>

          <button
            disabled={!canDelete}
            onClick={() => onDelete(cat, booksCount)}
            className={`p-2.5 rounded-xl transition ${
              canDelete
                ? "text-red-600 hover:bg-red-50 hover:text-red-800"
                : "text-gray-300 cursor-not-allowed"
            }`}
            title={
              canDelete
                ? "Eliminar"
                : `No se puede eliminar: tiene ${booksCount} libro(s)`
            }
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
