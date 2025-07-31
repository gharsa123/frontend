import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiLogOut,
  FiGrid,
  FiMenu,
  FiBarChart2,
  FiX,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); 

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-4 rounded-md hover:bg-yellow-100 transition-all ${
      isActive ? "bg-[#ffd21f] font-semibold " : "text-gray-700"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-100 overflow-hidden">
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white p-4 shadow-md">
        <button onClick={() => setSidebarOpen(true)}>
          <FiMenu size={24} />
        </button>
        <h1 className="text-lg font-bold">Pinukuik Abi</h1>
      </header>
      <aside
        className={`z-40 md:static bg-white shadow-md transform transition-all duration-300 ease-in-out
          fixed h-full overflow-y-auto
          ${sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full"}
          md:translate-x-0 md:flex-shrink-0 md:block md:min-h-screen`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <div className="hidden md:flex justify-between items-center p-4 border-b">
          <div className="h-[30px] flex items-center w-[30px] shrink-0">
            <img
              src="/LogoAbiBulat.png" 
              alt="Logo"
              className="h-full w-full ml-2 object-contain"
            />
            {sidebarOpen && <h1 className="ml-4">@pinukuik_abi</h1>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 ml-4 hover:text-gray-900"
          >
            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        <div className="p-4 space-y-2">
          <nav className="flex flex-col gap-2">
            <NavLink to="/admin/pesanan" className={navItemClass}>
              <FiMenu /> {sidebarOpen && "Pesanan"}
            </NavLink>
            <NavLink to="/admin/laporan" className={navItemClass}>
              <FiBarChart2 /> {sidebarOpen && "Laporan"}
            </NavLink>
            <NavLink to="/admin/products" className={navItemClass}>
              <FiGrid /> {sidebarOpen && "Produk"}
            </NavLink>
            <NavLink to="/admin/users" className={navItemClass}>
              <FiSettings /> {sidebarOpen && "User"}
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-4 text-red-600 hover:bg-red-100 rounded-md transition"
            >
              <FiLogOut /> {sidebarOpen && "Logout"}
            </button>
          </nav>
        </div>
      </aside>
      {!sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}
      <main
        className={`flex-1 overflow-y-auto bg-gray-50 min-h-screen transition-all duration-300 ease-in-out`}
      >
        <div className="pt-16 md:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
