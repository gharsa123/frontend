import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Save, X } from "lucide-react";

const UserPage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [newUser, setNewUser] = useState({
    name: "",
    whatsapp_number: "",
    username: "",
    password: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiBaseUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter((user) => user.role === "guest");
      setUsers(filtered);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user_id) => {
    const confirm = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiBaseUrl}/user/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.user_id !== user_id));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus user");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.user_id);
    setEditData({
      name: user.name,
      username: user.username,
      whatsapp_number: user.whatsapp_number,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (user_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiBaseUrl}/user/${user_id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((u) => (u.user_id === user_id ? { ...u, ...editData } : u)));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengupdate user");
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${apiBaseUrl}/user`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setNewUser({ name: "", whatsapp_number: "", username: "", password: "" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambahkan user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 return (
  <div className="bg-gray-50 min-h-screen p-2">
    <div className="bg-white p-4 h-screen">
      <div className="flex mb-4 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-medium px-4 py-2 rounded-lg text-sm shadow-sm"
          >
            + Tambah Pengguna
          </button>
        </div>
        <div className="flex right-8">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-lg shadow-sm text-sm w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#ffd21f]">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">No</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">WhatsApp</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Username</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  Memuat data pengguna...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-600">
                  {error}
                </td>
              </tr>
            ) : (
              users
                .filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.whatsapp_number.includes(searchTerm)
                )
                .map((user, idx) => {
                  const isEditing = editingId === user.user_id;

                  return (
                    <tr key={user.user_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.whatsapp_number}
                            onChange={(e) =>
                              setEditData({ ...editData, whatsapp_number: e.target.value })
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          user.whatsapp_number
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.username}
                            onChange={(e) =>
                              setEditData({ ...editData, username: e.target.value })
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          user.username
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(user.user_id)}
                              className="text-green-500 hover:underline text-sm"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-500 hover:underline text-sm"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-500 hover:underline text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.user_id)}
                              className="text-red-500 hover:underline text-sm"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
            )}
            {!loading && !error && users.filter(user =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.whatsapp_number.includes(searchTerm)
            ).length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal Tambah Pengguna */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tambah Pengguna Baru</h2>

          <div className="text-sm text-gray-700 space-y-3">
            <input
              type="text"
              placeholder="Nama"
              className="w-full border border-gray-300 p-2 rounded"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nomor WhatsApp"
              className="w-full border border-gray-300 p-2 rounded"
              value={newUser.whatsapp_number}
              onChange={(e) => setNewUser({ ...newUser, whatsapp_number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full border border-gray-300 p-2 rounded"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-2 rounded"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleAddUser}
              className="bg-yellow-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
              Simpan
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);



};

export default UserPage;
