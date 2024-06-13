import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmployeeProvider } from './employeeContext';
import './App.css';
import LoginPage from './login';
import DashboardSupervisor from './supervisor/dashboardSupervisor';
import Presensi from './supervisor/presensi';
import DashboardManager from './manager/dashboardManager';
import DashboardCustomer from './customer/dashboardCustomer';
import DataKaryawan from './manager/dataKaryawan';
import EditKaryawan from './manager/editKaryawan';
import GajiKaryawan from './manager/gajiKaryawan';
import TambahKaryawan from './manager/tambahKaryawan';
import Inventori from './admin/inventori';
import ReviewStok from './supervisor/reviewStok';
import TipeStok from './supervisor/tipeStok';
import Pemesanan from './admin/pemesanan';
import CheckoutPage from './customer/checkoutPage';
import PaymentPage from './customer/paymentPage';

function App() {
  return (
    <EmployeeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* SUPERVISOR */}
        <Route path="/supervisor/karyawan/presensi" element={<DashboardSupervisor />} />
        <Route path="/supervisor/karyawan/presensi/passcode" element={<Presensi />} />
        <Route path="/supervisor/karyawan/dataKaryawan" element={<DataKaryawan />} />
        <Route path="/supervisor/stok/reviewStok" element={<ReviewStok />} />
        <Route path="/supervisor/stok/tipeStok" element={<TipeStok />} />

        {/* ADMIN */}
        <Route path="/admin/pemesanan" element={<Pemesanan />} />
        <Route path="/admin/stok" element={<Inventori />} />

        {/* MANAGER */}
        <Route path="/manager/dashboard" element={<DashboardManager />} />
        <Route path="/manager/dataKaryawan" element={<DataKaryawan />} />
        <Route path="/manager/dataKaryawan/tambahKaryawan" element={<TambahKaryawan />} />
        <Route path="/manager/dataKaryawan/editKaryawan" element={<EditKaryawan />} />
        <Route path="/manager/gajiKaryawan" element={<GajiKaryawan />} />

        {/* CUSTOMER */}
        <Route path="/customer/dashboard" element={<DashboardCustomer />} />
        <Route path="/customer/checkoutPage" element={<CheckoutPage />} />
        <Route path="/customer/paymentPage" element={<PaymentPage />} />
      </Routes>
    </Router>
    </EmployeeProvider>
  );
}

export default App;
