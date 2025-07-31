import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Users, ChefHat, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AntrianPage = () => {
  const [antrianData, setAntrianData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchAntrian = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/order/antrian`);
      setAntrianData(res.data);
    } catch (error) {
      console.error("❌ Gagal mengambil antrian:", error);
    }
  };

  useEffect(() => {
    fetchAntrian();
    const socket = io(apiBaseUrl);
    socket.on("antrian_updated", fetchAntrian);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      socket.off("antrian_updated");
      clearInterval(timer);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sedang_diproses':
      case 'diproses':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'menunggu':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'selesai':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'sedang_diproses':
      case 'diproses':
        return 'Sedang Diproses';
      case 'menunggu':
        return 'Menunggu';
      case 'selesai':
        return 'Selesai';
      default:
        return 'Tidak diketahui';
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const selesaiDalam8JamTerakhir = antrianData.filter(item => {
    if (item.queue_status !== 'selesai') return false;
    const selesaiTime = new Date(item.updatedAt);
    const now = new Date();
    const diffHours = (now - selesaiTime) / (1000 * 60 * 60);
    return diffHours <= 8;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-1 sm:mb-2">Halaman Antrian</h2>
            <p className="text-gray-600 text-sm">Antrian yang sudah selesai ada di bagian paling bawah</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-center text-gray-600 mb-1">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-base font-semibold">
                {currentTime.toLocaleTimeString('id-ID')}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Total Antrian: {antrianData.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Daftar Antrian</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {antrianData.filter(item => item.queue_status !== 'selesai').map((item) => (
            <div key={item.order_id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-800 mr-4">
                      {item.queue_number}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(item.queue_status)}`}>
                      {getStatusText(item.queue_status)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Pesanan:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {item.items.map((i, index) => (
                        <li key={index} className="text-sm">
                          {i.product?.product_name} x {i.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3">
                    <span>Waktu Pesan: {new Date(item.createdAt).toLocaleTimeString('id-ID')}</span>
                    <span className="font-semibold text-gray-800">
                      {formatRupiah(item.total)}
                    </span>
                  </div>
                </div>

                <div className="ml-1 sm:ml-4">
                  {item.queue_status === 'diproses' && (
                    <div className="animate-pulse">
                      <ChefHat className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />
                    </div>
                  )}
                  {item.queue_status === 'menunggu' && (
                    <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Antrian Selesai</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {selesaiDalam8JamTerakhir.map((item) => (
            <div key={item.order_id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-800 mr-4">
                      {item.queue_number}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(item.queue_status)}`}>
                      {getStatusText(item.queue_status)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Pesanan:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {item.items.map((i, index) => (
                        <li key={index} className="text-sm">
                          {i.product?.product_name} x {i.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3">
                    <span>Waktu Pesan: {new Date(item.createdAt).toLocaleTimeString('id-ID')}</span>
                    <span className="font-semibold text-gray-800">
                      {formatRupiah(item.total)}
                    </span>
                  </div>
                </div>

                <div className="ml-1 sm:ml-4">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AntrianPage;
