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
    <div className="p-6 text-black">
      <div className="max-w-bg-white rounded-xl shadow overflow-hidden w-full">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Autores</h1>
            <p className="text-sm text-gray-500 mt-1">
              Administra autores y controla si tienen libros asociados.
            </p>

           
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xl font-medium shadow hover:bg-blue-700 transition active:scale-[0.98]"
          >
            <FiPlus /> Nuevo autor
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-11 py-2.5 rounded-full border border-gray-300 bg-white shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search.trim() && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition"
                title="Limpiar"
              >
                <FiX className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 font-medium">
                {authors.length === 0 ? "No hay autores registrados" : "No se encontraron autores"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {authors.length === 0
                  ? "Crea un nuevo autor para comenzar."
                  : "Prueba con otro término de búsqueda."}
              </p>
            </div>
          ) : (
            <div className="py-1">
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
    </div>
  );
}
