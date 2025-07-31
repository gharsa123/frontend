import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../../shared/Card";
import CartBar from "../../shared/CartBar";
import { FiX } from "react-icons/fi";

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nama, setNama] = useState("")
  const [searchTerm, setSearchTerm] = useState("");
  const [snapToken, setSnapToken] = useState(null);
  const [isSnapReady, setIsSnapReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/products`);
        setMenu(res.data);
      } catch (err) {
        if (err.response) {
        } else if (err.request) {
        } else {
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-PH0u-dvXYcluCCdK");
    script.onload = () => setIsSnapReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    console.log("snapToken:", snapToken);
    console.log("isSnapReady:", isSnapReady);
    console.log("window.snap:", typeof window.snap);
    if (snapToken && isSnapReady && typeof window.snap !== "undefined") {
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          setSnapToken(null);
          setCart({});
          setPhoneNumber("");
          setShowCheckoutForm(false);
        },
        onPending: function (result) {
          alert("Menunggu pembayaran selesai di Midtrans.");
          setSnapToken(null);
        },
        onError: function (result) {
          alert("Pembayaran gagal.");
          console.error(result);
          setSnapToken(null);
        },
        onClose: function () {
          alert("Popup ditutup tanpa menyelesaikan pembayaran.");
          setSnapToken(null);
        },
      });
    }
  }, [snapToken, isSnapReady]);

  const addToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.product_id]: (prev[item.product_id] || 0) + 1,
    }));
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const newQty = (prev[item.product_id] || 0) - 1;
      if (newQty <= 0) {
        const updatedCart = { ...prev };
        delete updatedCart[item.product_id];
        return updatedCart; 
      }
      return {
        ...prev,
        [item.product_id]: newQty,
      };
    });
  };

  const isValidPhoneNumber = (number) => {
    const phoneRegex = /^08[0-9]{8,11}$/;
    return phoneRegex.test(number);
  };

  const handleBayar = async () => {
    if (!phoneNumber.trim()) {
      alert("Nomor WhatsApp wajib diisi!");
      return;
    }
    if (!nama.trim()) {
      alert("Nama wajib diisi!");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      alert("Nomor WhatsApp tidak valid! Contoh: 08xxxxxxxxxx");
      return;
    }
    try {
      const orderItems = Object.entries(cart).map(([product_id, qty]) => {
        const product = menu.find((p) => p.product_id === parseInt(product_id));
        if (!product) {
          console.warn(`Produk dengan ID ${product_id} tidak ditemukan`);
          return null;
        }
        return {
          product_id: parseInt(product_id),
          quantity: qty,
          item_price: product.price,
        };
      }).filter(Boolean);
      const total = orderItems.reduce(
        (sum, item) => sum + item.item_price * item.quantity,
        0
      );
      console.log("Payload dikirim:", {
        phone_number: phoneNumber,
        items: orderItems,
        total,
      });
      console.log(" orderItems", orderItems);
      const res = await axios.post(`${apiBaseUrl}/order`, {
        whatsapp_number: phoneNumber,
        name: nama,
        items: orderItems,
        total,
      });
      console.log("Setting snapToken ke state:", res.data.snap_token);
      localStorage.setItem("invoice_id", res.data.invoice_id);
      setSnapToken(res.data.snap_token);
    } catch (err) {
      console.error("Gagal membuat order:", err);
      alert("Gagal melakukan pembayaran.");
    }
  };

  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = menu.find((p) => p.product_id === parseInt(id));
    return product ? sum + product.price * qty : sum;
  }, 0);

 return (
  <div className="min-h-screen px-4 sm:px-6 md:px-10 lg:px-15 py-4 pb-24 bg-white">
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 hover:border-gray-600 hover:bg-gray-100 px-3 py-2 rounded-full mb-4 w-full max-w-md text-sm"
      />
    </div>

    <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {menu
        .filter(
          (item) =>
            item.is_active &&
            (item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .map((item) => (
          <Card
            key={item.product_id}
            title={item.product_name}
            description={item.description}
            price={`Rp ${item.price.toLocaleString("id-ID")}`}
            image={`${apiBaseUrl}/${item.image}`}
            children={
              cart[item.product_id] ? (
                <div className="flex items-center justify-center w-full gap-4">
                  <button
                    onClick={() => removeFromCart(item)}
                    className="w-9 h-9 border-2 border-[#ffd21f] bg-white text-gray-700 hover:bg-gray-100 font-bold rounded-full text-lg"
                  >
                    -
                  </button>
                  <span className="text-sm">{cart[item.product_id]}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-9 h-9 border-2 border-[#ffd21f] bg-white text-gray-700 hover:bg-gray-100 font-bold rounded-full text-lg"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(item)}
                  className="px-4 py-2 border font-bold rounded-full border-[#ffd21f] bg-white hover:bg-[#fffde7] text-yellow-500 w-full text-sm"
                >
                  Tambah
                </button>
              )
            }
          />
        ))}
    </div>

    {Object.keys(cart).length > 0 && (
      <div className="flex justify-center w-full">
      <CartBar
        itemCount={Object.values(cart).reduce((sum, qty) => sum + qty, 0)}
        restaurantName="Pinukuik Abi Padang"
        totalPrice={Object.entries(cart).reduce((sum, [id, qty]) => {
          const product = menu.find((p) => p.product_id === parseInt(id));
          return product ? sum + product.price * qty : sum;
        }, 0)}
        onClick={() => setShowCheckoutForm(true)}
      />
      </div>
    )}

    {showCheckoutForm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out">
        <div className="bg-white w-full max-w-md sm:max-w-lg mx-4 rounded-xl p-4 shadow-lg relative transform transition-all duration-300 scale-95 opacity-0 animate-fadeIn max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Konfirmasi Pesanan</h2>
          <button
            onClick={() => setShowCheckoutForm(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            aria-label="Tutup"
          >
            <FiX size={24} />
          </button>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan Nama..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 mb-3">
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {Object.entries(cart).map(([id, qty]) => {
                const product = menu.find((p) => p.product_id === parseInt(id));
                if (!product) return null;
                return (
                  <div key={id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <p className="text-sm text-gray-800 font-medium w-1/3">{product.product_name}</p>
                    <div className="flex items-center space-x-2 w-1/3 justify-center">
                      <button
                        onClick={() => removeFromCart(product)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-[#ffd21f] bg-white text-gray-700 text-xs hover:bg-[#fffde7]"
                      >
                        −
                      </button>
                      <span className="text-sm">{qty}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-[#ffd21f] bg-white text-gray-700 text-xs hover:bg-[#fffde7]"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold text-right w-1/3">
                      Rp {(product.price * qty).toLocaleString("id-ID")}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center border-t border-gray-300 pt-2 mt-2">
              <p className="font-semibold text-sm text-gray-700">Total</p>
              <p className="text-base font-bold text-gray-800">
                Rp {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleBayar}
              className="px-4 py-2 bg-[#FFD21F] w-full text-white rounded-full hover:bg-yellow-400 text-sm"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
export default MenuPage;
