// src/pages/Loans/Loans.jsx
import React, { useEffect, useState } from "react";
import { getLoans, createLoan, returnLoan } from "../../api/loansService";
import { getUsers } from "../../api/usersService";
import { getBooks } from "../../api/booksService";
import LoanModal from "./LoanModal";
import DeleteModal from "../Users/DeleteModal";
import { FiPlus, FiSearch,FiCheckCircle, FiClock } from "react-icons/fi";
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

  const handleCreate = () => {
    setCurrentLoan(null);
    setOpenModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      await createLoan({
        userId: data.userId,
        bookId: data.bookId,
      });
      toast.success("Préstamo registrado");
      setOpenModal(false);
      loadData();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "No se pudo registrar el préstamo";
      toast.error(msg);
    }
  };

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

  const filteredLoans = loans.filter((l) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (l.userFullName || "").toLowerCase().includes(term) ||
      (l.bookTitle || "").toLowerCase().includes(term)
    );
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    const aReturned = !!a.returnDate;
    const bReturned = !!b.returnDate;

    if (aReturned !== bReturned) return aReturned ? 1 : -1;
    return new Date(b.loanDate) - new Date(a.loanDate);
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
        <h1 className="text-2xl font-bold text-gray-800">Préstamos</h1>
         <p className="text-sm text-gray-500 mt-1">
              Administra los prestamos de libros y controla si están devueltos.
            </p>
            </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 
                     bg-blue-600 text-white font-medium rounded-full shadow 
                     hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <FiPlus />
          Nuevo préstamo
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por usuario o libro..."
          className="w-full pl-11 pr-11 py-2.5 px-4 py-2.5 rounded-full border border-gray-300 
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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


      {/* Lista */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {sortedLoans.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500">
            No hay préstamos registrados.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedLoans.map((loan) => {
              const isReturned = !!loan.returnDate;
              const statusColor = isReturned
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700";
              const StatusIcon = isReturned ? FiCheckCircle : FiClock;

              return (
                <li
                  key={loan.id}
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar + contenido principal */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xl flex-shrink-0">
                        {loan.userFullName?.[0] || "U"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <p className="font-semibold text-gray-900 text-base truncate">
                            {loan.userFullName}
                          </p>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {isReturned ? "Devuelto" : "Pendiente"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mt-1 truncate">
                          {loan.bookTitle}
                        </p>

                        <p className="text-xs text-gray-600 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                          <span>📅 Prestado: {formatDate(loan.loanDate)}</span>
                          {loan.returnDate && (
                            <span>✔️ Devuelto: {formatDate(loan.returnDate)}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Botón devolver */}
                    {!isReturned && (
                      <div className="mt-3 sm:mt-0 sm:ml-auto">
                        <button
                          onClick={() => handleReturnClick(loan)}
                          className="w-full sm:w-auto px-4 py-2 text-sm border border-blue-500 
                                     text-blue-600 rounded-full hover:bg-blue-50 transition"
                        >
                          Marcar devuelto
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <LoanModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        users={users}
        books={books}
      />

      <DeleteModal
        isOpen={openReturn}
        onClose={() => setOpenReturn(false)}
        onConfirm={confirmReturn}
        itemName={`${currentLoan?.userFullName} - ${currentLoan?.bookTitle}`}
      />
    </div>
  );
}