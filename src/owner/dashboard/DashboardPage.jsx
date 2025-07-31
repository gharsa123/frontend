import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  PackageCheck,
  Info,
} from "lucide-react";
import "chart.js/auto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/dashboard/summary`);
      setData(res.data);
    } catch (err) {
      console.error("Gagal ambil data dashboard:", err);
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  const {
    penjualanHariIni,
    penjualan7Hari,
    totalBulanan,
    produkTerlaris,
    stokHampirHabis,
    antreanLonjakan,
  } = data;

  return (
    <div className="p-2 md:p-2 space-y-6">
      {(stokHampirHabis.length > 0 || antreanLonjakan) && (
        <div className="space-y-3">
          {stokHampirHabis.length > 0 && (
            <NotifCard
              type="warning"
              title="Stok Hampir Habis"
              message={`Ada ${stokHampirHabis.length} produk dengan stok < 5.`}
            />
          )}
          {antreanLonjakan && (
            <NotifCard
              type="danger"
              title="Lonjakan Antrean"
              message="Terdeteksi antrean menunggu lebih dari 5 dalam 30 menit terakhir."
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={<DollarSign />}
          label="Penjualan Hari Ini"
          value={`Rp${penjualanHariIni}`}
        />
        <SummaryCard
          icon={<TrendingUp />}
          label="Total Bulanan"
          value={`Rp${totalBulanan}`}
        />
        <SummaryCard
          icon={<PackageCheck />}
          label="Produk Terlaris"
          value={`${
            produkTerlaris?.[0]?.product?.product_name || "-"
          }`}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">
          Penjualan 7 Hari Terakhir
        </h2>
        <div className="w-[300px] sm:w-full">
          <Line
            data={{
              labels: penjualan7Hari.map((d) => d.tanggal),
              datasets: [
                {
                  label: "Total Penjualan",
                  data: penjualan7Hari.map((d) => d.total_harian),
                  fill: true,
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59,130,246,0.2)",
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Top 5 Produk Terlaris</h2>
        <div className="w-[300px] sm:w-full">
          <Bar
            data={{
              labels: produkTerlaris.map((p) => p.product.product_name),
              datasets: [
                {
                  label: "Jumlah Terjual",
                  data: produkTerlaris.map((p) => p.total_terjual),
                  backgroundColor: "#10b981",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
    <div className="text-blue-600">{icon}</div>
    <div>
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);

const NotifCard = ({ type = "info", title, message }) => {
  const colors = {
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  const Icon =
    type === "warning"
      ? AlertTriangle
      : type === "danger"
      ? Info
      : Info;

  return (
    <div
      className={`rounded-lg p-4 shadow ${colors[type]} flex flex-col sm:flex-row items-start gap-2`}
    >
      <Icon className="mt-1" size={20} />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
};

export default DashboardPage;
