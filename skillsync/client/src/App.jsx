import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import Browse      from './pages/Browse';
import ServiceDetail from './pages/ServiceDetail';
import Profile     from './pages/Profile';
import Dashboard   from './pages/Dashboard';
import Login       from './pages/Login';
import Register    from './pages/Register';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/browse"        element={<Browse />} />
          <Route path="/services/:id"  element={<ServiceDetail />} />
          <Route path="/profile/:id"   element={<Profile />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
