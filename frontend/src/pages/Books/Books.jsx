// src/pages/Books/Books.jsx
import React, { useEffect, useState } from "react";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getAuthors,
  getCategories,
} from "../../api/booksService";

import { createAuthor } from "../../api/authorService";
import { createCategory } from "../../api/categoryService";

import BookCard from "./BookCard";
import BookModal from "./BookModal";
import DeleteModal from "../Users/DeleteModal";

import AuthorModal from "../Authors/AuthorModal";
import CategoryModal from "../Categories/CategoryModal";

import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  // ✅ Modales reales
  const [openAuthorModal, setOpenAuthorModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  // ✅ para auto-seleccionar luego de crear
  const [pendingSelect, setPendingSelect] = useState({
    authorId: null,
    categoryId: null,
  });

  const clearPendingSelect = (key) => {
    setPendingSelect((prev) => ({ ...prev, [key]: null }));
  };

  // =============================
  // Cargar datos
  // =============================
  const loadData = async () => {
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        getBooks(),
        getAuthors(),
        getCategories(),
      ]);

      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error("Error al cargar datos");
    }
  };

  const reloadAuthors = async () => {
    const res = await getAuthors();
    setAuthors(res.data);
  };

  const reloadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // =============================
  // CRUD HANDLERS (Books)
  // =============================
  const handleCreate = () => {
    setCurrentBook(null);
    setOpenModal(true);
  };

  const handleEdit = (book) => {
    setCurrentBook(book);
    setOpenModal(true);
  };

  const handleDelete = (book) => {
    setCurrentBook(book);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBook(currentBook.id);
      toast.success("Libro eliminado");
      setOpenDelete(false);
      loadData();
    } catch (error) {
      toast.error("No se pudo eliminar el libro");
    }
  };

  const handleSubmit = async (data) => {
    try {
      const payload = {
        title: data.title.trim(),
        description: (data.description || "").trim(),
        year: Number(data.year),
        imageUrl: (data.imageUrl || "").trim(),
        quantity: Number(data.quantity),
        authorId: data.authorId,
        categoryId: data.categoryId,
      };

      if (currentBook) {
        await updateBook(currentBook.id, payload);
        toast.success("Libro actualizado");
      } else {
        await createBook(payload);
        toast.success("Libro creado");
      }

      setOpenModal(false);
      setCurrentBook(null);
      loadData();
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  // =============================
  // Crear autor / categoría desde BookModal
  // =============================
  const handleOpenAuthorModal = () => setOpenAuthorModal(true);
  const handleOpenCategoryModal = () => setOpenCategoryModal(true);

  const extractId = (res) => {
    // soporta: GUID directo o { id: guid }
    if (!res) return null;
    if (typeof res.data === "string") return res.data;
    if (res.data?.id) return res.data.id;
    return null;
  };

  const handleAuthorSubmit = async (data) => {
    try {
      const res = await createAuthor(data);
      const newId = extractId(res);

      await reloadAuthors();
      setOpenAuthorModal(false);

      if (newId) {
        setPendingSelect((p) => ({ ...p, authorId: newId }));
      }

      toast.success("Autor creado");
    } catch (e) {
      toast.error(e.response?.data?.message || "No se pudo crear el autor");
    }
  };

  const handleCategorySubmit = async (data) => {
    try {
      const res = await createCategory(data);
      const newId = extractId(res);

      await reloadCategories();
      setOpenCategoryModal(false);

      if (newId) {
        setPendingSelect((p) => ({ ...p, categoryId: newId }));
      }

      toast.success("Categoría creada");
    } catch (e) {
      toast.error(e.response?.data?.message || "No se pudo crear la categoría");
    }
  };

  // =============================
  // FILTRO DE BÚSQUEDA
  // =============================
  const filteredBooks = books.filter((b) => {
    const term = search.toLowerCase();
    return (
      (b.title || "").toLowerCase().includes(term) ||
      (b.authorFullName || "").toLowerCase().includes(term) ||
      (b.categoryName || "").toLowerCase().includes(term)
    );
  });

  // =============================
  // UI
  // =============================
  return (
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de libros</h1>
      </div>
{/* Search */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar por título, autor o categoría..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-11 pr-11 py-2.5 px-4 py-2.5 rounded-full border border-gray-300 
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />{search.trim() && (
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


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 xl:grid-cols-5 grap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          No hay libros registrados.
        </p>
      )}

      <button
        onClick={handleCreate}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-full shadow-xl p-4 transition hover:scale-110"
      >
        <FiPlus size={24} />
      </button>

      {/* Modal libro */}
      <BookModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        book={currentBook}
        authors={authors}
        categories={categories}

        // ✅ abre modales reales
        onAddAuthor={handleOpenAuthorModal}
        onAddCategory={handleOpenCategoryModal}

        // ✅ auto-select
        pendingSelect={pendingSelect}
        clearPendingSelect={clearPendingSelect}
      />

      {/* Modal Eliminar libro */}
      <DeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        itemName={currentBook?.title}
      />

      {/* Modal real: Autor */}
      <AuthorModal
        isOpen={openAuthorModal}
        onClose={() => setOpenAuthorModal(false)}
        onSubmit={handleAuthorSubmit}
        current={null}
        allAuthors={authors}
      />

      {/* Modal real: Categoría */}
      <CategoryModal
        isOpen={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onSubmit={handleCategorySubmit}
        current={null}
        allCategories={categories}
      />
    </div>
  );
}
