import React from "react";
import { FiEdit2, FiTrash2, FiUser, FiLock } from "react-icons/fi";
import { BookOpenIcon } from "@heroicons/react/24/outline";

function badgeClasses(count) {
  if (count === 0) return "bg-gray-100 text-gray-700 border-gray-200";
  if (count <= 2) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-purple-50 text-purple-700 border-purple-200";
}

export default function AuthorRow({
  author,
  booksCount = 0,
  onEdit,
  onDelete,
  onViewBooks,
}) {
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
            <FiUser />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xl">
              <p className="font-semibold text-gray-900 truncate">
                {author.fullName}
              </p>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] border ${badgeClasses(
                  booksCount
                )}`}
                title={`${booksCount} libro(s) asociados`}
              >
                {booksCount} libro(s)
              </span>

              {!canDelete && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] border bg-gray-50 text-gray-500 border-gray-200"
                  title="No se puede eliminar porque tiene libros asociados"
                >
                  <FiLock /> No eliminable
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 mt-0.5">
              {canDelete ? "Sin libros asociados" : "Tiene libros asociados"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onViewBooks(author)}
            className="px-3 py-2 rounded-xl text-purple-600 hover:bg-purple-50 hover:text-purple-800 transition flex items-center gap-2 text-sm"
            title="Ver libros"
          >
            <BookOpenIcon className="w-5" />
            <span className="hidden sm:inline">Libros</span>
          </button>

          <button
            onClick={() => onEdit(author)}
            className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
            title="Editar"
          >
            <FiEdit2 />
          </button>

          <button
            disabled={!canDelete}
            onClick={() => onDelete(author, booksCount)}
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
