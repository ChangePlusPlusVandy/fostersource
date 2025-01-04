import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import authService from "../services/authService";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog/Catalog";
import Login from "../pages/UserAuth/Login";
import Register from "../pages/UserAuth/Register";
import ResetPassword from "../pages/UserAuth/resetPassword";
import ResetPasswordForm from "../pages/UserAuth/resetPasswordForm";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
    </Routes>
  </Router>
);

export default AppRoutes;
