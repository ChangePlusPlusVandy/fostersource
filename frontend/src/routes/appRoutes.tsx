import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { Sidebar } from "../components/sidebar";
import HeaderBar from "../components/headerBar";

const AppRoutes: React.FC = () => (
  <Router>
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ width: "100%" }}>
        <HeaderBar />
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Sidebar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default AppRoutes;
