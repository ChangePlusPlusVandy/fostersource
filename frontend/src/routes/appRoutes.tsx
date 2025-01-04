import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog/Catalog"
import Login from "../pages/UserAuth/Login";
import Register from "../pages/UserAuth/Register";
import ResetPassword from "../pages/UserAuth/resetPassword";
import ResetPasswordForm from "../pages/UserAuth/resetPasswordForm";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
    </Routes>
  </Router>
);

export default AppRoutes;
