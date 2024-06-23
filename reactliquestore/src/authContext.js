import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        initializing: true, // Tambahkan state untuk menandai proses inisialisasi
    });

    useEffect(() => {
        // Initialize auth state from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setAuth({
                isAuthenticated: true,
                user: userData,
                initializing: false, // Set initializing ke false setelah selesai inisialisasi
            });
        } else {
            setAuth({
                isAuthenticated: false,
                user: null,
                initializing: false, // Set initializing ke false setelah selesai inisialisasi
            });
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth({
            isAuthenticated: true,
            user: userData,
            initializing: false, // Pastikan initializing tetap false setelah login
        });
        navigateBasedOnRole(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setAuth({
            isAuthenticated: false,
            user: null,
            initializing: false, // Pastikan initializing tetap false setelah logout
        });
        navigate('/login');
    };

    const navigateBasedOnRole = (getEmployee) => {
        switch (getEmployee.accessRight.id) {
            case 1:
                navigate('/admin/orderDelivery/pemesanan');
                break;
            case 2:
                navigate('/supervisor/karyawan/presensi');
                break;
            case 3:
                navigate('/manager/karyawan/presensi');
                break;
            case 4:
                navigate('/customer/checkoutPage');
                break;
            default:
                navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {!auth.initializing && children} {/* Hanya render children setelah selesai inisialisasi */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
