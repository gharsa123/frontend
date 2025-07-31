import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await axios.post(`${apiBaseUrl}/auth/login`, {
        username,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "admin":
          navigate("/admin/pesanan");
          break;
        case "owner":
          navigate("/owner/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300">
          <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-3 sm:mb-4 shadow-md bg-gray-100">
              <img
                src="/LogoAbiBulat.png"
                alt="Logo Abi"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Selamat Datang</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Silakan masuk untuk melanjutkan
            </p>
          </div>

          <div className="px-6 sm:px-8 pb-8 sm:pb-10">
            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ffd21f] hover:bg-yellow-400 text-gray-800 font-semibold rounded-full py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 focus:ring-4 focus:ring-yellow-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2 text-xs sm:text-sm">
              <div className="text-gray-500">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Daftar sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
