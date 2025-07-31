import { useEffect, useState } from "react";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ProductPage = () => {
  const initialForm = {
    product_name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    is_active: true,
  };

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(initialForm);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditPopover, setShowEditPopover] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetchProducts();
  }, [filterType]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/products`, {
        params: filterType ? { type: filterType } : {},
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, val]) =>
        formData.append(key, val)
      );

      await axios.post(`${apiBaseUrl}/products`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewProduct(initialForm);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(" Gagal menambahkan produk:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(productToEdit).forEach(([key, val]) =>
        formData.append(key, val)
      );

      await axios.put(
        `${apiBaseUrl}/products/${productToEdit.product_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setShowEditPopover(false);
      fetchProducts();
    } catch (err) {
      console.error("❌ Gagal mengedit produk:", err);
    }
  };


  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await axios.delete(`${apiBaseUrl}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
    } catch (err) {
      console.error("❌ Gagal menghapus produk:", err);
    }
  };


  const toggleProductStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `${apiBaseUrl}/products/${id}`,
        { is_active: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchProducts();
    } catch (err) {
      console.error("❌ Gagal toggle status produk:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2">
      <div className="max-w-6xl mx-auto bg-white p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-[#ffd21f] text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-yellow-100 transition"
            onClick={() => setShowModal(true)}
          >
            + Tambah Produk
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#ffd21f] text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Gambar</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) =>
                  p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((p, index) => (
                  <tr key={p.product_id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{p.product_name}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2 text-green-700 font-semibold">
                      Rp {Number(p.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{p.stock}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleProductStatus(p.product_id, p.is_active)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition ${p.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {p.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <img
                        src={`${apiBaseUrl}/${p.image}`}
                        alt={p.product_name}
                        className="w-20 h-16 object-cover rounded shadow mx-auto"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setProductToEdit(p);
                          setShowEditPopover(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.product_id)}
                        className="text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* Tambah Produk */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl w-[400px] shadow-lg space-y-4 text-sm font-sans"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Tambah Produk</h2>

            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nama Produk"
              value={newProduct.product_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, product_name: e.target.value })
              }
              required
            />

            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Deskripsi"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Harga"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Stok"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              required
            />

            <input
              type="file"
              className="w-full p-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-800 hover:file:bg-yellow-300"
              accept="image/*"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold rounded-lg"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Modal Edit Produk */}
      {showEditPopover && productToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-2xl w-[400px] shadow-lg space-y-4 text-sm font-sans"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Edit Produk</h2>

            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={productToEdit.product_name}
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  product_name: e.target.value,
                })
              }
            />

            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={productToEdit.description}
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  description: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={productToEdit.price}
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  price: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={productToEdit.stock}
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  stock: e.target.value,
                })
              }
            />

            <input
              type="file"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-800 hover:file:bg-yellow-300"
              accept="image/*"
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  image: e.target.files[0],
                })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                onClick={() => setShowEditPopover(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold rounded-lg"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );

};

export default ProductPage;
