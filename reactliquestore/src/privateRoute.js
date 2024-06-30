import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ roles }) => {
    const { auth } = useAuth();

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(auth.user.accessRight.id)) {
        switch (auth.user.accessRight.id) {
            case 1:
                return <Navigate to="/admin/pemesanan" />;
            case 2:
                return <Navigate to="/supervisor/karyawan/presensi" />;
            case 3:
                return <Navigate to="/manager/karyawan/presensi" />;
            case 4:
                return <Navigate to="/customer/checkout" />;
            default:
                return <Navigate to="/login" />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
