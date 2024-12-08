import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog/Catalog"

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
    </Routes>
  </Router>
);

export default AppRoutes;
