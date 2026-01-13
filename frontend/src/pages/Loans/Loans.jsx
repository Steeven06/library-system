// src/pages/Loans/Loans.jsx
import React, { useEffect, useState } from "react";
import { getLoans, createLoan, returnLoan } from "../../api/loansService";
import { getUsers } from "../../api/usersService";
import { getBooks } from "../../api/booksService";
import LoanModal from "./LoanModal";
import DeleteModal from "../Users/DeleteModal"; // reutilizamos tu modal de confirmación
import { FiPlus, FiCheckCircle, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);

  const loadData = async () => {
    try {
      const [loansRes, usersRes, booksRes] = await Promise.all([
        getLoans(),
        getUsers(),
        getBooks(),
      ]);

      setLoans(loansRes.data);
      setUsers(usersRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar préstamos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Crear préstamo
  const handleCreate = () => {
    setCurrentLoan(null);
    setOpenModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      await createLoan({
        userId: data.userId,
        bookId: data.bookId,
        // LoanDate lo pone el backend
      });
      toast.success("Préstamo registrado");
      setOpenModal(false);
      loadData();
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "No se pudo registrar el préstamo";
      toast.error(msg);
    }
  };

  // Devolver préstamo
  const handleReturnClick = (loan) => {
    setCurrentLoan(loan);
    setOpenReturn(true);
  };

  const confirmReturn = async () => {
    try {
      await returnLoan(currentLoan.id);
      toast.success("Préstamo marcado como devuelto");
      setOpenReturn(false);
      setCurrentLoan(null);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo marcar como devuelto");
    }
  };

  // Filtro de búsqueda por usuario o libro
  const filteredLoans = loans.filter((l) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      l.userFullName.toLowerCase().includes(term) ||
      l.bookTitle.toLowerCase().includes(term)
    );
  });

  // Orden: primero pendientes, luego devueltos más recientes
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    const aReturned = !!a.returnDate;
    const bReturned = !!b.returnDate;

    if (aReturned !== bReturned) {
      return aReturned ? 1 : -1; // pendientes arriba
    }

    return new Date(b.loanDate) - new Date(a.loanDate);
  });

  return (
    <div className="p-6 text-black">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Préstamos
        </h1>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-base font-medium shadow hover:bg-blue-700 transition"
        >
          <FiPlus /> Nuevo préstamo
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por usuario o libro..."
          className="w-full px-4 py-2 rounded-full border border-gray-300 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista tipo Gmail */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {sortedLoans.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-base">
            No hay préstamos registrados.
          </div>
        ) : (
          <ul className="divide-y">
            {sortedLoans.map((loan) => {
              const isReturned = !!loan.returnDate;
              const statusColor = isReturned
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700";
              const StatusIcon = isReturned ? FiCheckCircle : FiClock;

              return (
                <li
  key={loan.id}
  className="flex items-center gap-4 px-5 py-3 
             hover:bg-gray-50 hover:shadow-md hover:-translate-y-[1px]
             transition-all duration-200 ease-in-out cursor-default"
>

  {/* Avatar inicial del usuario */}
  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xl">
    {loan.userFullName?.[0] || "U"}
  </div>

  {/* Info principal */}
  <div className="flex-1 min-w-0">

    {/* Primera fila: usuario + badge + fecha */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        <p className="font-semibold text-gray-900 text-[15px] truncate">
          {loan.userFullName}
        </p>

        <span
          className={`badge-bounce inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
            isReturned
              ? "bg-green-100 text-green-700 border border-yellow-300"
              : "bg-yellow-100 text-yellow-700 border border-yellow-300 badge-pulse"
          }`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {isReturned ? "Devuelto" : "Pendiente"}
        </span>
      </div>

    </div>

    {/* Título del libro */}
    <p className="text-sm text-gray-800 mt-0.5 truncate">
      {loan.bookTitle}
    </p>

    {/* Fechas con íconos */}
    <p className="text-xs text-gray-600 mt-0.5 truncate flex items-center gap-2">

      <span className="flex items-center gap-1">
        📅 Prestado: {formatDate(loan.loanDate)}
      </span>

      {loan.returnDate && (
        <span className="flex items-center gap-1">
          ✔️ Devuelto: {formatDate(loan.returnDate)}
        </span>
      )}
    </p>

  </div>

  {/* Botón devolver */}
  {!isReturned && (
    <button
      onClick={() => handleReturnClick(loan)}
      className="text-sm px-3 py-1.5 rounded-full border border-blue-500 
                 text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
    >
      Marcar devuelto
    </button>
  )}
</li>

              );
            })}
          </ul>
        )}
      </div>

      {/* Modal crear préstamo */}
      <LoanModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        users={users}
        books={books}
      />

      {/* Modal confirmar devolución (reutilizamos DeleteModal) */}
      <DeleteModal
        isOpen={openReturn}
        onClose={() => setOpenReturn(false)}
        onConfirm={confirmReturn}
        itemName={`${currentLoan?.userFullName} - ${currentLoan?.bookTitle}`}
        // si tu DeleteModal no usa itemName, igual funcionará con solo isOpen/onClose/onConfirm
      />
    </div>
  );
}
