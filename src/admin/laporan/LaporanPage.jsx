import { useEffect, useState, useRef } from "react";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const LaporanPage = () => {
  const [laporan, setLaporan] = useState([]);
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [detail, setDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef();

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/laporan`);
      setLaporan(res.data);
      setFilteredLaporan(res.data);
    } catch (err) {
      console.error("Gagal mengambil laporan:", err);
    }
  };

  const fetchFiltered = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axios.get(`${apiBaseUrl}/laporan`, { params });
      setFilteredLaporan(res.data);
    } catch (err) {
      console.error("Gagal filter laporan:", err);
    }
  };

  const handleViewDetail = async (laporan) => {
    console.log("Laporan yang diklik:", laporan);
    try {
      const res = await axios.get(`${apiBaseUrl}/laporan/${laporan.order_id}`);
      setSelectedLaporan(res.data);
      setDetail(res.data.items || []);
      setShowModal(true);
    } catch (err) {
      console.error("Gagal mengambil detail:", err);
    }
  };

  const handlePrint = () => {
  if (selectedLaporan?.invoice_id) {
    window.open(`/invoice/${selectedLaporan.invoice_id}`, "_blank");
  }
};

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDateTime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPenjualan = filteredLaporan
    .filter((item) => item.payment_status === "lunas")
    .reduce((a, c) => a + c.total, 0);

 return (
  <div className="bg-gray-50 min-h-screen p-1 sm:p-2">
    <div className="bg-white p-2 sm:p-4 h-screen">
      <div className="flex flex-col sm:flex-row mb-4 gap-2 sm:justify-between sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm w-full sm:w-auto"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm w-full sm:w-auto"
          />
          <button
            onClick={fetchFiltered}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm shadow-sm"
          >
            Filter
          </button>
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 sm:px-4 py-2 rounded-lg shadow-sm text-xs sm:text-sm w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-[#ffd21f]">
            <tr>
              <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">No</th>
              <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Invoice</th>
              <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Waktu</th>
              <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Total</th>
              <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLaporan
              .filter((item) =>
                item.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item, idx) => (
                <tr key={item.order_id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2">{idx + 1}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{item.invoice_id}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{item.name}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{formatDateTime(item.createdAt)}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{formatCurrency(item.total)}</td>
                  <td className="px-2 sm:px-4 py-2">
                    <span
                      className={`px-1 sm:px-2 py-1 rounded text-xs font-semibold ${
                        item.payment_status === "lunas"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.payment_status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="text-blue-500 hover:underline text-xs sm:text-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            {filteredLaporan.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400 text-xs sm:text-sm">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>

    {showModal && selectedLaporan && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
        <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-lg p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 border-b pb-2">Detail Invoice</h2>

          <div ref={printRef} className="text-xs sm:text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">Invoice:</span> {selectedLaporan.invoice_id}
            </p>
            <p>
              <span className="font-semibold">Nama:</span> {selectedLaporan.name}
            </p>
            <p>
              <span className="font-semibold">Waktu:</span> {formatDateTime(selectedLaporan.createdAt)}
            </p>

            <div className="overflow-x-auto mt-4 -mx-2 sm:mx-0">
              <table className="w-full text-left border border-gray-200 rounded min-w-[280px]">
                <thead className="bg-yellow-400 text-gray-800">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 border-b text-xs">Produk</th>
                    <th className="px-2 sm:px-3 py-2 border-b text-xs">Qty</th>
                    <th className="px-2 sm:px-3 py-2 border-b text-xs">Harga</th>
                    <th className="px-2 sm:px-3 py-2 border-b text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-3 py-2 border-b text-xs">{item.product?.product_name || "-"}</td>
                      <td className="px-2 sm:px-3 py-2 border-b text-xs">{item.quantity}</td>
                      <td className="px-2 sm:px-3 py-2 border-b text-xs">{formatCurrency(item.item_price)}</td>
                      <td className="px-2 sm:px-3 py-2 border-b text-xs">
                        {formatCurrency(item.quantity * item.item_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right font-semibold text-gray-800 mt-3 text-xs sm:text-sm">
              Total: {formatCurrency(selectedLaporan.total)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="bg-yellow-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-yellow-400 transition text-sm"
            >
              Cetak
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
);

};

export default LaporanPage;
