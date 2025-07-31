import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock, Phone, AlertCircle } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    whatsapp_number: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (!/^08[0-9]{8,12}$/.test(form.whatsapp_number)) {
      setError("Nomor WhatsApp tidak valid (harus diawali 08)");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/auth/register`, {
        name: form.name.trim(),
        whatsapp_number: form.whatsapp_number.trim(),
        username: form.username.trim(),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300">

          <div className="bg-white px-6 sm:px-8 pt-6 pb-2 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-3 shadow-md bg-gray-100">
              <img
                src="/LogoAbiBulat.png"
                alt="Logo Abi"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Daftar Akun</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-1">
              Lengkapi data di bawah ini
            </p>
          </div>

          <div className="px-6 sm:px-8 pt-4 pb-6">
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp_number" className="text-sm font-medium text-gray-700">
                  Nomor WhatsApp
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    value={form.whatsapp_number}
                    onChange={handleChange}
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    type="text"
                    placeholder="Masukkan username"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    required
                    className="w-full pl-10 pr-12 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle Password Visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    required
                    className="w-full pl-10 pr-12 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ffd21f] hover:bg-yellow-400 text-gray-800 font-semibold rounded-full py-2.5 text-sm sm:text-base transition-all duration-200 focus:ring-4 focus:ring-yellow-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  "Daftar"
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-xs sm:text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default RegisterPage;
