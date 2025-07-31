import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './auth/LoginPage';
import ClientLayout from './client/clientLayout';
import AdminLayout from './admin/adminLayout'
import MenuPage from './client/menu/MenuPage';
import ProductPage from './admin/product/ProductPage';
import AntrianPage from './client/antrian/AntrianPage';
import OrderPage from './admin/pesanan/OrderPage';
import LaporanPage from './admin/laporan/LaporanPage';
import LaporanPageOwner from './owner/laporan/LaporanPage';
import DashboardPageOwner from './owner/dashboard/DashboardPage';
import OwnerLayout from './owner/OwnerLayout'
import RegisterPage from './auth/RegisterPage';
import UserPage from './admin/user/UserPage';
import InvoicePage from './shared/Invoice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<MenuPage />} />

        <Route path="/invoice/:invoiceId" element={<InvoicePage />} />

        <Route path="/admin" element={<ProtectedRoute role='admin'><AdminLayout /></ProtectedRoute>}>
            <Route index element={<OrderPage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="pesanan" element={<OrderPage />} />
            <Route path="laporan" element={<LaporanPage />} />
            <Route path="users" element={<UserPage />} />
        </Route>

        <Route path="/owner" element={<ProtectedRoute role='owner'><OwnerLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPageOwner />} />
            <Route path="dashboard" element={<DashboardPageOwner />} />
            <Route path="laporan" element={<LaporanPageOwner />} />
        </Route>

        <Route path="/" element={<ClientLayout />}>
          <Route index element={<MenuPage />} />
          <Route path="/" element={<MenuPage />} />
          <Route path="/antrian" element={<AntrianPage />} />

        </Route>

      </Routes>
    </Router>
  )
}
export default App