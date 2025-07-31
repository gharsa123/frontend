import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiLogOut, FiLogIn, FiMenu, FiX, FiGrid, FiList } from "react-icons/fi";

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const navItemClass = ({ isActive }) =>
    `relative cursor-pointer py-3 px-4 capitalize text-sm font-medium transition-colors duration-300 ${
      isActive
        ? "text-yellow-600 font-semibold border-b-2 border-yellow-400"
        : "text-gray-500 hover:text-yellow-500"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-[54px]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-full px-4 md:px-8">

          <div className="flex items-center">
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <a href="/" className="h-[30px] w-[30px] shrink-0">
              <img
                src="/LogoAbiBulat.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </a>
            <a href="/" className="ml-2 mr-4 h-[30px] w-[130px] shrink-0">
              <img
                src="/logoPinukuik.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </a>
            <ul className="hidden md:flex items-center space-x-1">
              <li>
                <NavLink to="/" className={navItemClass}>
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink to="/antrian" className={navItemClass}>
                  Antrian
                </NavLink>
              </li>
            </ul>
          </div>

         <div className="hidden md:flex items-center">
            {!isLoggedIn ? (
              <NavLink
                to="/login"
                className="py-2 px-4 bg-yellow-200 text-yellow-700 rounded-full hover:bg-yellow-300 transition-all text-sm"
              >
                Masuk
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-yellow-200 text-yellow-700 hover:bg-yellow-300 rounded-full transition-all text-sm"
              >
                Keluar
              </button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[54px] left-0 right-0 bg-white shadow-lg border-t z-40">
            <div className="px-4 py-3 space-y-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-yellow-200 font-semibold text-yellow-800"
                      : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
                onClick={handleMobileNavClick}
              >
                <FiGrid /> Menu
              </NavLink>
              <NavLink
                to="/antrian"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-yellow-200 font-semibold text-yellow-800"
                      : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
                onClick={handleMobileNavClick}
              >
                <FiList /> Antrian
              </NavLink>
              <div className="pt-2 border-t border-gray-200">
                {!isLoggedIn ? (
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-green-600 hover:bg-green-100 transition"
                    onClick={handleMobileNavClick}
                  >
                    <FiLogIn /> Masuk
                  </NavLink>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-yellow-800 hover:bg-yellow-100 rounded-md transition"
                  >
                    <FiLogOut /> Keluar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 mt-[54px] overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
