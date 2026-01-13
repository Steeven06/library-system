import React, { useEffect, useRef, useState } from "react";

export default function UserModal({ isOpen, onClose, onSubmit, user }) {
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    cedula: "",
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const isValidFullName = (value) => {
    if (!value) return false;

    const cleaned = value.trim().replace(/\s+/g, " ");
    const parts = cleaned.split(" ");

    if (parts.length < 2) return false;

    return parts.every((p) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}$/.test(p));
  };

  function validate() {
    const e = {};

    if (!isValidFullName(form.fullName))
      e.fullName =
        "Ingrese nombre y apellido válidos (solo letras, mínimo 2 palabras).";

    if (!/^\d{10}$/.test(form.cedula))
      e.cedula = "La cédula debe tener 10 dígitos";

    if (!/^\d{10}$/.test(form.phone)) e.phone = "Número inválido (10 dígitos)";

    // puedes hacer un regex más fuerte si quieres, pero esto vale
    if (!form.email.includes("@")) e.email = "Email inválido";

    if ((form.address || "").trim().length < 3)
      e.address = "Dirección demasiado corta";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSave = () => {
    if (!validate()) return;
    onSubmit({
      ...form,
      fullName: form.fullName.trim().replace(/\s+/g, " "),
      address: form.address.trim(),
      email: form.email.trim(),
    });
  };

  // ✅ cargar datos / limpiar
  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setForm({
        fullName: user.fullName || "",
        cedula: user.cedula || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
    } else {
      setForm({
        fullName: "",
        cedula: "",
        phone: "",
        email: "",
        address: "",
      });
    }

    setErrors({});
  }, [user, isOpen]);

  // ✅ autofocus al abrir (listo para escribir sin click)
  useEffect(() => {
    if (!isOpen) return;

    requestAnimationFrame(() => {
      firstInputRef.current?.focus();
      if (user) firstInputRef.current?.select(); // opcional: al editar selecciona
    });
  }, [isOpen, user]);

  // ✅ ESC para cerrar + ENTER para guardar (sin textarea / IME)
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag === "textarea") return; // por si luego pones textarea
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, form]); // form para que guarde el estado actual

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // ✅ click fuera del modal cierra
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Editar usuario" : "Crear usuario"}
        </h2>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="text-sm font-medium">Nombre completo</label>
            <input
              ref={firstInputRef}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.fullName}
              onChange={(e) => {
                setForm({
                  ...form,
                  fullName: e.target.value.replace(/\s+/g, " "),
                });
                setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Cédula */}
          <div>
            <label className="text-sm font-medium">Cédula</label>
            <input
              inputMode="numeric"
              maxLength={10}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.cedula ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.cedula}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setForm({ ...form, cedula: onlyDigits });
                setErrors((prev) => ({ ...prev, cedula: "" }));
              }}
            />
            {errors.cedula && (
              <p className="text-red-500 text-sm">{errors.cedula}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-sm font-medium">Teléfono</label>
            <input
              inputMode="numeric"
              maxLength={10}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.phone}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setForm({ ...form, phone: onlyDigits });
                setErrors((prev) => ({ ...prev, phone: "" }));
              }}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="text-sm font-medium">Dirección</label>
            <input
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.address}
              onChange={(e) => {
                setForm({ ...form, address: e.target.value });
                setErrors((prev) => ({ ...prev, address: "" }));
              }}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
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
