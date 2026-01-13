import React, { useEffect, useMemo, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryService";
import { getBooks } from "../../api/booksService";

import CategoryModal from "./CategoryModal";
import DeleteModal from "../Users/DeleteModal";
import CategoryRow from "./CategoryRow";

import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [current, setCurrent] = useState(null);

  const loadData = async () => {
    try {
      const [catRes, booksRes] = await Promise.all([getCategories(), getBooks()]);
      setCategories(catRes.data);
      setBooks(booksRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar categorías");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // filtro
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((c) => (c.name || "").toLowerCase().includes(term));
  }, [categories, search]);

  const handleSave = async (data) => {
    try {
      if (current) {
        await updateCategory(current.id, data);
        toast.success("Categoría actualizada");
      } else {
        await createCategory(data);
        toast.success("Categoría creada");
      }
      setOpenModal(false);
      setCurrent(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(current.id);
      toast.success("Categoría eliminada");
      setOpenDelete(false);
      setCurrent(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar");
    }
  };

  const handleEdit = (cat) => {
    setCurrent(cat);
    setOpenModal(true);
  };

  const handleDeleteClick = (cat, booksCount) => {
    if (booksCount > 0) {
      toast.error(
        `No puedes eliminar esta categoría porque tiene ${booksCount} libro(s) asignado(s).`
      );
      return;
    }
    setCurrent(cat);
    setOpenDelete(true);
  };

  const getBooksCount = (catName) =>
    (books || []).filter(
      (b) =>
        (b.categoryName || "").toLowerCase() === (catName || "").toLowerCase()
    ).length;

  return (
    <div className="p-6 text-black">
      
      {/* Header */}
      <div className="flex items-start md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
   
          <p className="text-sm text-gray-500 mt-2">
            Administra categorías y controla si tienen libros asignados.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrent(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition active:scale-[0.98]"
        >
          <FiPlus /> Nueva categoría
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-11 py-2.5 rounded-full border border-gray-300 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* ✅ LISTA (ya no tabla) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600 font-semibold">
              {categories.length === 0
                ? "No hay categorías registradas"
                : "No se encontraron categorías"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {categories.length === 0
                ? "Crea una nueva categoría para comenzar."
                : "Prueba con otro término de búsqueda."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((cat) => {
              const booksCount = getBooksCount(cat.name);
              return (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  booksCount={booksCount}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSave}
        current={current}
        allCategories={categories}
      />

      <DeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        itemName={current?.name}
      />
    </div>
  );
}
