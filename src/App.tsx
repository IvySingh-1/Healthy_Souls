import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { PatientRecords } from './pages/PatientRecords';
import { SymptomChecker } from './pages/SymptomChecker';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PatientRoute({ children }: { children: React.ReactNode }) {
  const aadharNumber = localStorage.getItem('patientAadhar');
  return aadharNumber ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Doctor Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="records" element={<PatientRecords />} />
          <Route path="symptoms" element={<SymptomChecker />} />
        </Route>

        {/* Patient Routes */}
        <Route
          path="/patient-dashboard"
          element={
            <PatientRoute>
              <PatientDashboard />
            </PatientRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;