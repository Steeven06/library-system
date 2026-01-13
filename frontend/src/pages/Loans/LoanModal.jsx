// src/pages/Loans/LoanModal.jsx
import React, { useEffect, useRef, useState } from "react";

export default function LoanModal({ isOpen, onClose, onSubmit, users, books }) {
  const [form, setForm] = useState({ userId: "", bookId: "" });

  const [errors, setErrors] = useState({});

  // Inputs de búsqueda
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  // Mostrar listas
  const [showUserList, setShowUserList] = useState(false);
  const [showBookList, setShowBookList] = useState(false);

  // Índices de navegación
  const [userIndex, setUserIndex] = useState(-1);
  const [bookIndex, setBookIndex] = useState(-1);

  // Debounce buffers
  const [debouncedUser, setDebouncedUser] = useState("");
  const [debouncedBook, setDebouncedBook] = useState("");

  // Refs para detectar clicks afuera
  const userRef = useRef();
  const bookRef = useRef();

  // Reset modal al abrir
  useEffect(() => {
    if (isOpen) {
      setForm({ userId: "", bookId: "" });
      setUserSearch("");
      setBookSearch("");
      setShowUserList(false);
      setShowBookList(false);
      setUserIndex(-1);
      setBookIndex(-1);
      setErrors({});
    }
  }, [isOpen]);

  // -------------------------------
  // 🔥 Debounce inteligente (300ms)
  // -------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedUser(userSearch), 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBook(bookSearch), 300);
    return () => clearTimeout(timer);
  }, [bookSearch]);

  // -------------------------------
  // ❌ Cerrar dropdown si clic afuera
  // -------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserList(false);
      }
      if (bookRef.current && !bookRef.current.contains(e.target)) {
        setShowBookList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------
  // 🔍 FILTROS (optimizados con debounce)
  // -------------------------------
  const filteredUsers = users.filter((u) => {
    const t = debouncedUser.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(t) ||
      (u.cedula && u.cedula.includes(t))
    );
  });

  const filteredBooks = books.filter((b) => {
    const t = debouncedBook.toLowerCase();
    return (
      b.title.toLowerCase().includes(t) ||
      b.authorFullName.toLowerCase().includes(t)
    );
  });

  // -------------------------------
  // 🔥 Validación
  // -------------------------------
  const validate = () => {
    const e = {};
    if (!form.userId) e.userId = "Selecciona un usuario";
    if (!form.bookId) e.bookId = "Selecciona un libro";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
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
    if (!validate()) return;
    onSubmit(form);
  };

  if (!isOpen) return null;

  // -------------------------------
  // ⭐ NAV con teclas
  // -------------------------------
  const handleUserKeyDown = (e) => {
    if (!showUserList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setUserIndex((prev) => Math.min(prev + 1, filteredUsers.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setUserIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter" && userIndex >= 0) {
      const u = filteredUsers[userIndex];
      selectUser(u);
    }
  };

  const handleBookKeyDown = (e) => {
    if (!showBookList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setBookIndex((prev) => Math.min(prev + 1, filteredBooks.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setBookIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter" && bookIndex >= 0) {
      const b = filteredBooks[bookIndex];
      selectBook(b);
    }
  };

  // -------------------------------
  // ⭐ Funciones select
  // -------------------------------
  const selectUser = (u) => {
    setForm({ ...form, userId: u.id });
    setUserSearch(`${u.fullName} — ${u.cedula}`);
    setShowUserList(false);
  };

  const selectBook = (b) => {
    setForm({ ...form, bookId: b.id });
    setBookSearch(`${b.title} — ${b.authorFullName}`);
    setShowBookList(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-fadeIn relative">

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Nuevo préstamo
        </h2>

        <div className="space-y-4">

          {/* -------------------------- */}
          {/* 🔵 AUTOCOMPLETE USUARIO     */}
          {/* -------------------------- */}
          <div className="relative" ref={userRef}>
            <label className="text-sm font-medium text-gray-700">
              Usuario
            </label>

            <input
              type="text"
              value={userSearch}
              placeholder="Buscar por nombre o cédula..."
              onChange={(e) => {
                setUserSearch(e.target.value);
                setShowUserList(true);
                setUserIndex(-1);
              }}
              onKeyDown={handleUserKeyDown}
              onFocus={() => setShowUserList(true)}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.userId ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
            />

            {showUserList && (
              <ul className="absolute w-full bg-white rounded-lg shadow-lg mt-1 max-h-40 overflow-auto z-20
                             animate-[fadeIn_0.15s_ease-out]">

                {filteredUsers.length === 0 && (
                  <li className="px-3 py-2 text-gray-500 text-sm italic">
                    No se encontraron usuarios
                  </li>
                )}

                {filteredUsers.map((u, i) => (
                  <li
                    key={u.id}
                    className={`px-3 py-2 cursor-pointer text-sm flex justify-between 
                      ${i === userIndex ? "bg-blue-100" : "hover:bg-gray-100"}`}
                    onClick={() => selectUser(u)}
                  >
                    <span>
                      <strong>{u.fullName}</strong> — {u.cedula}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {errors.userId && (
              <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
            )}
          </div>

          {/* -------------------------- */}
          {/* 🔵 AUTOCOMPLETE LIBRO       */}
          {/* -------------------------- */}
          <div className="relative" ref={bookRef}>
            <label className="text-sm font-medium text-gray-700">
              Libro
            </label>

            <input
              type="text"
              value={bookSearch}
              placeholder="Buscar libro..."
              onChange={(e) => {
                setBookSearch(e.target.value);
                setShowBookList(true);
                setBookIndex(-1);
              }}
              onKeyDown={handleBookKeyDown}
              onFocus={() => setShowBookList(true)}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                errors.bookId ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
            />

            {showBookList && (
              <ul className="absolute w-full bg-white rounded-lg shadow-lg mt-1 max-h-40 overflow-auto z-20
                             animate-[fadeIn_0.15s_ease-out]">

                {filteredBooks.length === 0 && (
                  <li className="px-3 py-2 text-gray-500 text-sm italic">
                    No se encontraron libros
                  </li>
                )}

                {filteredBooks.map((b, i) => (
                  <li
                    key={b.id}
                    className={`px-3 py-2 cursor-pointer text-sm flex justify-between items-center 
                      ${i === bookIndex ? "bg-blue-100" : "hover:bg-gray-100"}`}
                    onClick={() => selectBook(b)}
                  >
                    <div>
                      <strong>{b.title}</strong> — {b.authorFullName}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        b.availableQuantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.availableQuantity} disp.
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {errors.bookId && (
              <p className="text-red-500 text-sm mt-1">{errors.bookId}</p>
            )}
          </div>
        </div>

        {/* Botones */}
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
