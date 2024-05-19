import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './login';
import DashboardAdmin from './admin/dashboardAdmin';
import DashboardSupervisor from './supervisor/dashboardSupervisor';
import Presensi from './supervisor/presensi';
import DashboardManager from './manager/dashboardManager';
import DashboardCustomer from './customer/dashboardCustomer';
import DataKaryawan from './manager/dataKaryawan';
import EditKaryawan from './supervisor/editKaryawan';
import GajiKaryawan from './manager/gajiKaryawan';
import TambahKaryawan from './manager/tambahKaryawan';
import Inventori from './admin/inventori';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* SUPERVISOR */}
        <Route path="/supervisor/karyawan/presensi" element={<DashboardSupervisor />} />
        <Route path="/supervisor/karyawan/presensi/passcode" element={<Presensi />} />
        <Route path="/supervisor/karyawan/dataKaryawan" element={<DataKaryawan />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/pemesanan" element={<DashboardAdmin />} />
        <Route path="/admin/penyimpanan" element={<Inventori />} />

        {/* MANAGER */}
        <Route path="/manager/dashboard" element={<DashboardManager />} />
        <Route path="/manager/dataKaryawan" element={<DataKaryawan />} />
        <Route path="/manager/dataKaryawan/tambahKaryawan" element={<TambahKaryawan />} />
        <Route path="/manager/dataKaryawan/editKaryawan" element={<EditKaryawan />} />
        <Route path="/manager/gajiKaryawan" element={<GajiKaryawan />} />

        {/* CUSTOMER */}
        <Route path="/customer/dashboard" element={<DashboardCustomer />} />
      </Routes>
    </Router>
  );
}

export default App;
