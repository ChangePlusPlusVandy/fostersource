import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog/Catalog"
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/resetPassword";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  </Router>
);

export default AppRoutes;
