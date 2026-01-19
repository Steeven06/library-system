import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";

import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../api/authorService";

import { getBooks } from "../../api/booksService";

import AuthorModal from "./AuthorModal";
import BooksByAuthorModal from "./BooksByAuthorModal";
import DeleteModal from "../Users/DeleteModal";
import AuthorRow from "./AuthorRow";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openBooksModal, setOpenBooksModal] = useState(false);

  const [current, setCurrent] = useState(null);

  const loadData = async () => {
    try {
      const [authorsRes, booksRes] = await Promise.all([getAuthors(), getBooks()]);
      setAuthors(authorsRes.data);
      setBooks(booksRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar autores");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return authors;
    return authors.filter((a) => (a.fullName || "").toLowerCase().includes(t));
  }, [authors, search]);

  const booksCountByAuthor = (author) => {
    const authorName = (author?.fullName || "").toLowerCase();
    return (books || []).filter(
      (b) => (b.authorFullName || "").toLowerCase() === authorName
    ).length;
  };

  const handleCreate = () => {
    setCurrent(null);
    setOpenModal(true);
  };

  const handleEdit = (author) => {
    setCurrent(author);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (current) {
        await updateAuthor(current.id, data);
        toast.success("Autor actualizado");
      } else {
        await createAuthor(data);
        toast.success("Autor creado");
      }
      setOpenModal(false);
      setCurrent(null);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al guardar";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAuthor(current.id);
      toast.success("Autor eliminado");
      setOpenDelete(false);
      setCurrent(null);
      loadData();
    } catch (err) {
      toast.error("No se pudo eliminar");
    }
  };

  const handleViewBooks = (author) => {
    setCurrent(author);
    setOpenBooksModal(true);
  };

  const handleDeleteClick = (author, booksCount) => {
    if (booksCount > 0) {
      toast.error("No puedes eliminar este autor porque tiene libros asignados.");
      return;
    }
    setCurrent(author);
    setOpenDelete(true);
  };

  return (
    // ✅ Importante: centrado en móvil + max-width, sin afectar desktop
    <div className="px-3 py-4 sm:p-6 lg:p-8">
      <div
        className="
          w-full
          mx-auto
          max-w-[420px] sm:max-w-none
        "
      >
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 pb-3 sm:pb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Autores</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Administra autores y controla libros asociados.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="
                w-full sm:w-auto
                flex items-center justify-center gap-1.5
                px-5 py-2
                bg-blue-600 hover:bg-blue-700 text-white
                font-medium text-sm
                rounded-full shadow transition-colors
                whitespace-nowrap
              "
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              Nuevo
            </button>
          </div>

          {/* Buscador */}
          <div className="px-4 sm:px-6 pb-3 sm:pb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Buscar autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  pl-9 sm:pl-11 pr-9 sm:pr-11
                  py-2 sm:py-2.5
                  rounded-full border border-gray-300 bg-white shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all text-sm sm:text-base
                "
              />
              {search.trim() && (
                <button
                  onClick={() => setSearch("")}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    p-1 sm:p-2 rounded-full hover:bg-gray-100 transition
                  "
                  title="Limpiar"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* ✅ Lista SIN min-width (para evitar scroll horizontal en móvil) */}
          <div className="px-2 sm:px-0">
            {filtered.length === 0 ? (
              <div className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-600 text-sm">
                <p className="font-medium">
                  {authors.length === 0 ? "No hay autores" : "Sin resultados"}
                </p>
                <p className="mt-1 text-xs sm:text-sm">
                  {authors.length === 0 ? "Crea uno nuevo" : "Cambia la búsqueda"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((author) => {
                  const booksCount = booksCountByAuthor(author);
                  return (
                    <AuthorRow
                      key={author.id}
                      author={author}
                      booksCount={booksCount}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onViewBooks={handleViewBooks}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthorModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSave}
        current={current}
        allAuthors={authors}
      />

      <BooksByAuthorModal
        isOpen={openBooksModal}
        onClose={() => setOpenBooksModal(false)}
        author={current}
        books={books}
      />

      <DeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        itemName={current?.fullName}
      />
    </div>
  );
}
