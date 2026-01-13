import React, { useEffect, useRef } from "react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,

  // ✅ genérico
  title = "Eliminar",
  itemName = "",
  message = "Esta acción no se puede deshacer ⚠️.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",

  // opcional
  loading = false,
}) {
  const modalRef = useRef(null);

  // ESC cierra + Enter confirma
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        if (!loading) onConfirm();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, onConfirm, loading]);

  // foco al abrir (opcional)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => modalRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // ✅ click afuera cierra
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-[90vw] animate-fadeIn outline-none"
      >
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h2>

        <p className="text-gray-600 mb-6 text-xl">
          ¿Deseas eliminar{" "}
          {itemName ? (
            <>
              <strong className="text-gray-900">{itemName}</strong>?
            </>
          ) : (
            "este registro?"
          )}
          <br />
          <span className="text- text-red-500">{message}</span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition ${
              loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {cancelText} 
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition text-white ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Eliminando..." : `${confirmText} `}
          </button>
        </div>
      </div>
    </div>
  );
}
