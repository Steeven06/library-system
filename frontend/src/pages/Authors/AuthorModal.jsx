import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Helpers de validación
// ---------------------------
function normalizeName(name) {
  if (!name) return "";
  let clean = name.trim().replace(/\s+/g, " ");
  clean = clean
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return clean;
}

function isValidFullName(name) {
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(name)) return false;

  const words = name.trim().split(/\s+/);
  if (words.length < 2) return false;
  if (words.some((w) => w.length < 2)) return false;

  return true;
}

function getFocusable(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      `a[href], button:not([disabled]), textarea, input, select,
       [tabindex]:not([tabindex="-1"])`
    )
  ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

// ---------------------------
// MODAL
// ---------------------------
export default function AuthorModal({
  isOpen,
  onClose,
  onSubmit,
  current,
  allAuthors,
}) {
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // guarda el elemento que tenía foco antes de abrir
      lastFocusedRef.current = document.activeElement;

      setFullName(current?.fullName || "");
      setError("");

      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, current]);

  // restaurar foco al cerrar
  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      setTimeout(() => lastFocusedRef.current?.focus?.(), 0);
    }
  }, [isOpen]);

  const handleSave = () => {
    const normalized = normalizeName(fullName);

    if (!isValidFullName(normalized)) {
      setError(
        "Debe ingresar nombre y apellido (solo letras, mínimo 2 letras por palabra)"
      );
      return;
    }

    const exists = (allAuthors || []).some(
      (a) =>
        a.fullName?.toLowerCase() === normalized.toLowerCase() &&
        a.id !== current?.id
    );

    if (exists) {
      setError("Este autor ya está registrado.");
      return;
    }

    onSubmit({ fullName: normalized });
  };

  // teclado: ESC + ENTER + TRAP TAB
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // trap de foco con TAB
      if (e.key === "Tab") {
        const focusables = getFocusable(modalRef.current);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          // Shift+Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }

      // Enter guarda (evita IME)
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, fullName, current, allAuthors]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      role="dialog"
      aria-modal="true"
      aria-label={current ? "Editar autor" : "Crear autor"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // click fuera cierra
      }}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md animate-fadeIn"
      >
        <h2 className="text-xl font-semibold mb-4">
          {current ? "Editar autor" : "Nuevo autor"}
        </h2>

        <label className="text-sm font-medium">Nombre completo</label>
        <input
          ref={inputRef}
          type="text"
          className={`w-full px-3 py-2 mt-1 rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setError("");
          }}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancelar 
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Guardar 
          </button>
        </div>
      </div>
    </div>
  );
}
