import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { Sidebar } from "../components/sidebar";
import HeaderBar, { HeaderItems } from "../components/headerBar";

function AppRoutes() {
  const [isHeaderBarOpen, setIsHeaderBarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    window.innerWidth < 768
  );

  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div style={{ width: "100%" }}>
          <HeaderBar isOpen={isHeaderBarOpen} setIsOpen={setIsHeaderBarOpen} />
        </div>
        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        {isHeaderBarOpen && isCollapsed && (
          <div
            className="p-7"
            style={{
              position: "absolute",
              backgroundColor: "#f0f0f0",
              top: "4rem",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <HeaderItems
              displayOptions="flex flex-col gap-3"
              outline="border-black"
            />
          </div>
        )}
      </div>
    </Router>
  );
}

export default AppRoutes;
