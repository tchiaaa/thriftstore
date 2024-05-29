import React, { createContext, useEffect, useState } from 'react';

// Buat konteks
export const EmployeeContext = createContext();

// Buat penyedia konteks
export const EmployeeProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    // Coba ambil data employeeData dari localStorage saat aplikasi dimuat
    const storedEmployeeData = localStorage.getItem('employeeData');
    if (storedEmployeeData) {
        setEmployeeData(JSON.parse(storedEmployeeData));
    }
  }, []);

  useEffect(() => {
    // Simpan data employeeData ke localStorage setiap kali employeeData berubah
    if (employeeData) {
      localStorage.setItem('employeeData', JSON.stringify(employeeData));
    } else {
      localStorage.removeItem('employeeData');
    }
  }, [employeeData]);

  const clearEmployeeData = () => {
    setEmployeeData(null);
  };
  return (
    <EmployeeContext.Provider value={{ employeeData, setEmployeeData, clearEmployeeData }}>
      {children}
    </EmployeeContext.Provider>
  );
};
