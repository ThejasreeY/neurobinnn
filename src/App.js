import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import MapPage from "./MapPage";
import ComplaintPage from "./ComplaintPage";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";

import "leaflet/dist/leaflet.css";
import logo from "./assets/logo.png";

import { db } from "./firebase";
import { ref, onValue, off } from "firebase/database";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// 🔥 Fix Leaflet default marker
const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🔥 NAV LINK COMPONENT
function NavLink({ to, label, location, darkMode }) {
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: isActive ? "#38bdf8" : (darkMode ? "#94a3b8" : "#1e293b"),
        fontWeight: isActive ? "700" : "500",
        borderBottom: isActive ? "2px solid #38bdf8" : "none",
        paddingBottom: "2px",
        transition: "0.3s"
      }}
      onMouseEnter={(e) => (e.target.style.color = "#38bdf8")}
      onMouseLeave={(e) =>
        (e.target.style.color = isActive ? "#38bdf8" : (darkMode ? "#94a3b8" : "#1e293b"))
      }
    >
      {label}
    </Link>
  );
}

function App() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [data, setData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isHome = location.pathname === "/";

  // 🌙 Dark Mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.style.background = darkMode ? "#0f172a" : "#f5f7fa";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🔥 Firebase Data
  useEffect(() => {
    const dbRef = ref(db, "waste_bins");

    onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      setData(val || {});
    });

    return () => off(dbRef);
  }, []);

  return (
    <div>
      {/* 🔥 NAVBAR */}
      {!isHome && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 32px",
            background: darkMode
              ? "rgba(15, 23, 42, 0.9)"
              : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            color: darkMode ? "white" : "#0f172a",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          {/* LEFT */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none"
            }}
          >
            <img src={logo} alt="Neurobin" style={{ height: "34px" }} />
            <span style={{
              fontWeight: "700",
              fontSize: "18px",
              color: darkMode ? "#fff" : "#0f172a"
            }}>
              NeuroBin
            </span>
          </Link>

          {/* CENTER */}
          <div style={{ display: "flex", gap: "28px" }}>
            <NavLink to="/complaint" label="Complaint" location={location} darkMode={darkMode} />

            {isAdmin && (
              <>
                <NavLink to="/dashboard" label="Dashboard" location={location} darkMode={darkMode} />
                <NavLink to="/map" label="Map" location={location} darkMode={darkMode} />
              </>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

            {/* Admin Badge */}
            {isAdmin && (
              <div style={{
                padding: "5px 12px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1df630, #6ba480)",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                Admin
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: darkMode ? "#1e293b" : "#e2e8f0",
                fontSize: "14px"
              }}
            >
              {darkMode ? "🌙" : "☀️"}
            </button>

            {/* Login / Logout */}
            {isAdmin ? (
              <button
                onClick={() => {
                  localStorage.removeItem("isAdmin");
                  navigate("/");
                }}
                style={{
                  background: "#fd5b5b",
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "600"
                }}
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 🔥 ROUTES */}
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/dashboard"
          element={
            isAdmin
              ? <Dashboard
                  data={data}
                  hoverIndex={hoverIndex}
                  setHoverIndex={setHoverIndex}
                  darkMode={darkMode}
                />
              : <LoginPage />
          }
        />

        <Route
          path="/map"
          element={
            isAdmin
              ? <MapPage data={data} darkMode={darkMode} />
              : <LoginPage />
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/complaint" element={<ComplaintPage />} />
      </Routes>
    </div>
  );
}

export default App;
