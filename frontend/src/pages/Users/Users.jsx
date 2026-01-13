import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/usersService";
import UserModal from "./UserModal.jsx";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";

import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

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

  // ✅ Filtro por búsqueda (nombre, cédula, teléfono, email, dirección)
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
    <div className="p-6 text-black">
      {/* ✅ Header moderno */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-2 text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-700">{users.length}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm
                       focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full
                       bg-blue-600 text-white shadow hover:bg-blue-700 transition"
          >
            <FiPlus />
            Nuevo usuario
          </button>
        </div>
      </div>

      {/* ✅ Card + tabla pro */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">No hay usuarios que coincidan con tu búsqueda.</p>
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-blue-600 text-white hover:bg-blue-700 transition shadow"
            >
              <FiPlus /> Crear usuario
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead className="bg-gray-50 text-purple-600 text-xl">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left font-semibold">Cédula</th>
                  <th className="px-6 py-4 text-left font-semibold">Teléfono</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Dirección</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition">
                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{u.fullName}</div>
                    </td>

                    {/* Cédula */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full
                                       bg-gray-100 text-gray-700 border border-gray-200">
                        {u.cedula}
                      </span>
                    </td>

                    {/* Teléfono */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full
                                       bg-blue-50 text-blue-700 border border-blue-100">
                        {u.phone}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 max-w-[260px]">
                      <p className="truncate text-gray-700">{u.email}</p>
                    </td>

                    {/* Dirección */}
                    <td className="px-6 py-4 max-w-[220px]">
                      <p className="truncate text-gray-700">{u.address}</p>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                          title="Editar"
                          aria-label="Editar"
                        >
                          <FiEdit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                          title="Eliminar"
                          aria-label="Eliminar"
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
        )}
      </div>

      
      {/* Modal Crear / Editar */}
      <UserModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        user={currentUser}
      />

      {/* Modal Eliminar */}
      <DeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        itemName={currentUser?.fullName}
      />
    </div>
  );
}
