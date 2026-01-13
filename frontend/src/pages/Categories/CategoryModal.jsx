import React, { useEffect, useRef, useState } from "react";

function normalizeName(name) {
  if (!name) return "";
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function isValidCategory(name) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,40}$/.test(name);
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  current,
  allCategories,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName(current?.name || "");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, current]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSave();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, name]);

  const handleSave = () => {
    const normalized = normalizeName(name);

    if (!isValidCategory(normalized)) {
      setError("Solo letras, mínimo 3 caracteres.");
      return;
    }

    const exists = allCategories.some(
      (c) =>
        c.name.toLowerCase() === normalized.toLowerCase() &&
        c.id !== current?.id
    );

    if (exists) {
      setError("Esta categoría ya existe.");
      return;
    }

    onSubmit({ name: normalized });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">
          {current ? "Editar categoría" : "Nueva categoría"}
        </h2>

        <label className="text-sm font-medium">Nombre</label>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          className={`w-full px-3 py-2 mt-1 rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancelar 
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Guardar 
          </button>
        </div>
      </div>
    </div>
  );
}
