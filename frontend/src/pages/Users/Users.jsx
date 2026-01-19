import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/usersService";
import UserModal from "./UserModal.jsx";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";
import { FiPlus,FiSearch, FiEdit, FiTrash, FiX } from "react-icons/fi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = () => {
    setCurrentUser(null);
    setOpenModal(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setOpenModal(true);
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(currentUser.id);
      toast.success("Usuario eliminado");
      setOpenDelete(false);
      setCurrentUser(null);
      loadUsers();
    } catch (error) {
      toast.error("No se pudo eliminar el usuario");
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (currentUser) {
        await updateUser(currentUser.id, data);
        toast.success("Usuario actualizado correctamente");
      } else {
        await createUser(data);
        toast.success("Usuario creado correctamente");
      }

      setOpenModal(false);
      setCurrentUser(null);
      loadUsers();
    } catch (error) {
      const msg = error.response?.data?.message || "Ocurrió un error inesperado";
      toast.error(msg);
    }
  };

  const filteredUsers = users.filter((u) => {
    const t = search.toLowerCase();
    return (
      (u.fullName || "").toLowerCase().includes(t) ||
      (u.cedula || "").includes(t) ||
      (u.phone || "").includes(t) ||
      (u.email || "").toLowerCase().includes(t) ||
      (u.address || "").toLowerCase().includes(t)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50/30">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
           <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
         
          <p className="text-sm text-gray-500 mt-1">
              Administra los usuarios y controla si tienen prestamos.
            </p>
            </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 
                     bg-blue-600 text-white font-medium rounded-full shadow 
                     hover:bg-blue-700 transition w-full sm:w-auto"
          >
            <FiPlus size={18} />
            Nuevo usuario
          </button>
       </div>
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-11 py-2.5 px-4 py-2.5 rounded-full border border-gray-300 
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  

      {/* Contenido principal */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500 border border-gray-100">
          <p>No hay usuarios que coincidan con tu búsqueda.</p>
          <button
            onClick={handleCreate}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white
                       rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            <FiPlus /> Crear usuario
          </button>
        </div>
      ) : (
        <>
          {/* Vista de tarjetas SOLO en móvil (hidden en md+) */}
          <div className="md:hidden space-y-4">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base text-gray-900">
                      {u.fullName}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-600"
                      >
                        <FiTrash size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    {u.cedula && <div><strong>Cédula:</strong> {u.cedula}</div>}
                    {u.phone && <div><strong>Teléfono:</strong> {u.phone}</div>}
                    {u.email && <div><strong>Email:</strong> {u.email}</div>}
                    {u.address && <div><strong>Dirección:</strong> {u.address}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla original SOLO en escritorio (hidden en móviles) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">
                      Cédula
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">
                      Teléfono
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">
                      Dirección
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{u.fullName}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-sm border border-gray-200">
                          {u.cedula}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-100">
                          {u.phone}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-[240px]">
                        <p className="truncate">{u.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-[220px]">
                        <p className="truncate">{u.address}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          >
                            <FiTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modales */}
      <UserModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        user={currentUser}
      />

      <DeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        itemName={currentUser?.fullName}
      />
    </div>
  );
}