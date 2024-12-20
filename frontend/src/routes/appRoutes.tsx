import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Sidebar from "../components/sidebar";

const AppRoutes: React.FC = () => (
  <Router>
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Sidebar />
      </div>{" "}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  </Router>
);

export default AppRoutes;
