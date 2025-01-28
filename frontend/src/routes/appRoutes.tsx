import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CoursePage from "../pages/courseDetailPage/courseDetailsPage";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courseDetails" element={<CoursePage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
