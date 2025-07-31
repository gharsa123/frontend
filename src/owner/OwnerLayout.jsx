import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiLogOut,
  FiMenu,
  FiBarChart2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-md transition ${
      isActive
        ? "bg-[#ffd21f] text-gray-700 font-semibold"
        : "text-gray-700 hover:bg-yellow-100"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

 return (
  <div className="min-h-screen flex bg-gray-100">
    <div
      className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 md:static md:w-64 w-72 max-w-[85vw]`}
    >
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <img src="/LogoAbiBulat.png" alt="Logo" className="h-8 w-8 flex-shrink-0" />
          <span className=" text-lg">@pinukuik_abi</span>
        </div>
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors" 
          onClick={() => setSidebarOpen(false)}
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="p-4 flex flex-col gap-2 h-full overflow-y-auto">
        <NavLink to="/owner/dashboard" className={navItemClass}>
          <FiMenu className="flex-shrink-0" /> 
          <span>Pesanan</span>
        </NavLink>
        <NavLink to="/owner/laporan" className={navItemClass}>
          <FiBarChart2 className="flex-shrink-0" /> 
          <span>Laporan</span>
        </NavLink>    
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
        >
          <FiLogOut className="flex-shrink-0" /> 
          <span>Logout</span>
        </button>
      </nav>
    </div>

    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <div className="flex-1 flex flex-col min-h-screen">
      <header className="md:hidden flex items-center justify-between p-4 bg-white shadow z-10">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-lg font-bold">Pinukuik Abi</h1>
        <div className="w-6" />
      </header>

      <main className="flex-1 overflow-y-auto pt-2 md:pt-0 px-2 md:px-2 py-2 bg-gray-50">
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default Layout;
