import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const socket = io(apiBaseUrl);

const OrderPage = () => {
  const [antrian, setAntrian] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAntrian = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/order/antrian`);
      const data = res.data.filter(order => order.payment_status === "lunas");
      setAntrian(data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal fetch antrian:", err);
    }
  };

  useEffect(() => {
    fetchAntrian();
    socket.on("antrian_updated", fetchAntrian);
    return () => socket.off("antrian_updated");
  }, []);

  const antrianAktif = antrian.find(a => a.queue_status === "diproses");
  const antrianBerikutnya = antrian
    .filter(a => a.queue_status === "menunggu")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const antrianSelesaiHariIni = antrian.filter(a => {
    if (a.queue_status !== "selesai") return false;

    const updated = new Date(a.updatedAt); // gunakan finishedAt jika tersedia
    const now = new Date();

    return (
      updated.getDate() === now.getDate() &&
      updated.getMonth() === now.getMonth() &&
      updated.getFullYear() === now.getFullYear()
    );
  });

  const handleSelesaiPesanan = async () => {
    if (!antrianAktif) return;

    try {
      await axios.put(`${apiBaseUrl}/order/antrian/${antrianAktif.order_id}`);
    } catch (err) {
      console.error("Gagal update status antrian:", err);
      alert("Gagal menyelesaikan pesanan");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Memuat data antrian...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 min-h-screen bg-slate-50">

      {/* Kartu Pesanan Aktif */}
      <div className="w-full bg-white p-6 flex flex-col justify-between">
        {antrianAktif ? (
          <>
            <div>
              <div className="text-center mb-6">
                <h1 className="font-bold text-5xl text-green-600">
                  {antrianAktif.no_antrian}
                </h1>
                <h2 className="text-lg text-gray-700 mt-2">{antrianAktif.name}</h2>
                <p className="text-sm text-gray-500">{antrianAktif.whatsapp_number}</p>
              </div>

              {/* Daftar Pesanan */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 font-semibold text-gray-600 border-b pb-2">
                  <span className="text-left">Menu</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Harga</span>
                </div>

                {antrianAktif.items.map((item) => (
                  <div key={item.item_id} className="grid grid-cols-3 text-gray-700">
                    <span className="text-left">{item.product.product_name}</span>
                    <span className="text-center">{item.quantity}</span>
                    <span className="text-right">
                      Rp {(item.quantity * item.item_price).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}

                <div className="grid grid-cols-3 text-gray-800 font-semibold pt-2 border-t mt-2">
                  <span className="text-left">Total</span>
                  <span className="text-center">
                    {antrianAktif.items.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                  <span className="text-right">
                    Rp {antrianAktif.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={handleSelesaiPesanan}
                className="w-full rounded-full text-gray-700 bg-[#ffd21f] hover:bg-yellow-200 p-3 transition"
              >
                Pesanan Selesai
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Tidak ada antrian aktif</p>
        )}
      </div>

      {/* Panel Statistik & Antrian Selanjutnya */}
      <div className="w-full bg-white p-6 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border shadow-xs p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {antrianBerikutnya.length}
            </h1>
            <h2 className="text-lg text-gray-600">Jumlah Antrian</h2>
          </div>
          <div className="bg-white rounded-xl border shadow-xs p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {antrianSelesaiHariIni.length}
            </h1>
            <h2 className="text-lg text-gray-600">Pesanan Selesai Hari Ini</h2>
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-xl font-semibold mb-4">Pesanan Selanjutnya:</h1>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 pb-4">
            {antrianBerikutnya.length > 0 ? (
              antrianBerikutnya.map((a, i) => (
                <div key={i} className="w-full bg-white rounded-lg border-l-4 shadow-sm border-l-yellow-400 p-4">
                  <h1 className="text-xl font-bold text-gray-800 mb-1">{a.name}</h1>
                  <h3 className="text-sm font-light text-gray-600">
                    {a.items.map(item => item.product.product_name).join(", ")}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    No. Antrian: {a.queue_number}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Tidak ada antrian berikutnya</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
