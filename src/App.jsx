import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css';
import { useEffect } from "react";

function AppLayout() {
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = localStorage.getItem("user");
      setUser(user);
    } else {
      setUser(null);
    }
  }, []);

  return (
    <>
      {(location.pathname !== "/login" && location.pathname !== "/register") && <Navbar />}
      <Toaster position="bottom-center" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
