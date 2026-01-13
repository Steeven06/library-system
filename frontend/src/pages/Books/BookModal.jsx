import React, { useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function BookModal({
  isOpen,
  onClose,
  onSubmit,
  book,
  authors,
  categories,

  // ✅ nuevas props para abrir modales reales
  onAddAuthor,
  onAddCategory,

  // ✅ para auto-seleccionar luego de crear
  pendingSelect, // { authorId: "guid", categoryId: "guid" }
  clearPendingSelect, // (key) => void   key: "authorId" | "categoryId"
}) {
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    year: "",
    imageUrl: "",
    quantity: "",
    authorId: "",
    categoryId: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Ref para evitar "stale state" al usar Enter/Esc con window keydown
  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        description: book.description || "",
        year: book.year?.toString() || "",
        imageUrl: book.imageUrl || "",
        quantity: book.quantity?.toString() || "",
        authorId: book.authorId || "",
        categoryId: book.categoryId || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        year: "",
        imageUrl: "",
        quantity: "",
        authorId: "",
        categoryId: "",
      });
    }
    setErrors({});
  }, [book, isOpen]);

  // ✅ AUTOFOCUS al abrir (cursor listo para escribir)
  useEffect(() => {
    if (!isOpen) return;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (book) inputRef.current?.select();
    });
  }, [isOpen, book]);

  // ✅ Auto-seleccionar autor recién creado
  useEffect(() => {
    if (!isOpen) return;
    if (pendingSelect?.authorId) {
      setForm((prev) => ({ ...prev, authorId: pendingSelect.authorId }));
      clearPendingSelect?.("authorId");
    }
  }, [pendingSelect?.authorId, isOpen, clearPendingSelect]);

  // ✅ Auto-seleccionar categoría recién creada
  useEffect(() => {
    if (!isOpen) return;
    if (pendingSelect?.categoryId) {
      setForm((prev) => ({ ...prev, categoryId: pendingSelect.categoryId }));
      clearPendingSelect?.("categoryId");
    }
  }, [pendingSelect?.categoryId, isOpen, clearPendingSelect]);

  const currentYear = new Date().getFullYear();
  const MAX_QTY = 100;

  const validate = () => {
    const f = formRef.current; // ✅ siempre el form actual
    const e = {};

    if (!f.title.trim()) e.title = "El título es obligatorio";
    if (!f.authorId) e.authorId = "Seleccione un autor";
    if (!f.categoryId) e.categoryId = "Seleccione una categoría";

    const year = Number(f.year);
    if (!f.year || Number.isNaN(year) || !Number.isInteger(year)) {
      e.year = "El año debe ser un número entero";
    } else if (year < 1000 || year > currentYear) {
      e.year = `El año debe estar entre 1000 y ${currentYear}`;
    }

    const qty = Number(f.quantity);
    if (!f.quantity || Number.isNaN(qty) || !Number.isInteger(qty)) {
      e.quantity = "La cantidad debe ser un número entero";
    } else if (qty <= 0) {
      e.quantity = "La cantidad debe ser mayor a 0";
    } else if (qty > MAX_QTY) {
      e.quantity = `La cantidad máxima permitida es ${MAX_QTY}`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSubmit(formRef.current); // ✅ envía el form actual
  };

  // ✅ Teclado: ESC cierra, ENTER guarda (solo si el foco está dentro del BookModal)
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      const active = document.activeElement;

      // 👇 Si el foco está en otro modal (Autor/Categoría), NO hagas nada aquí
      if (active && modalRef.current && !modalRef.current.contains(active)) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        const tag = (active?.tagName || "").toLowerCase();
        if (tag === "textarea") return;
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]); // ✅ ya NO depende de form

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {book ? "Editar libro" : "Registrar libro"}
        </h2>

        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input
              ref={inputRef}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Autor + botón añadir */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Autor</label>
              <button
                type="button"
                onClick={onAddAuthor}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FiPlus /> Añadir autor
              </button>
            </div>

            <select
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.authorId ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.authorId}
              onChange={(e) => setForm({ ...form, authorId: e.target.value })}
            >
              <option value="">Seleccione un autor</option>
              {(authors || []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.fullName}
                </option>
              ))}
            </select>

            {errors.authorId && (
              <p className="text-red-500 text-xs mt-1">{errors.authorId}</p>
            )}
          </div>

          {/* Categoría + botón añadir */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Categoría
              </label>

              <button
                type="button"
                onClick={onAddCategory}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FiPlus /> Añadir categoría
              </button>
            </div>

            <select
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Seleccione una categoría</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Año y Cantidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Año</label>
              <input
                type="number"
                min={1000}
                max={currentYear}
                step={1}
                inputMode="numeric"
                className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                  errors.year ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                min={1}
                max={MAX_QTY}
                step={1}
                inputMode="numeric"
                className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* URL de imagen */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              URL de portada (opcional)
            </label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
