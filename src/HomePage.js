// src/HomePage.js
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";

function HomePage() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const navItems = isAdmin
    ? [
        {
          to: "/dashboard",
          label: "Dashboard",
          desc: "View real-time bin status",
          dark: true,
        },
        {
          to: "/map",
          label: "Map",
          desc: "See bin locations on live map",
        },
        {
          to: "/complaint",
          label: "Complaints",
          desc: "Manage and resolve complaints",
        },
      ]
    : [
        {
          to: "/complaint",
          label: "Raise Complaint",
          desc: "Report waste issues easily",
          dark: true,
        },
      ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f3f3",
        fontFamily: "'DM Sans', sans-serif",
        padding: "40px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* 🔥 HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #26949296, #1cc2cb)",
          padding: "40px 20px",
          textAlign: "center",
          color: "white",
          borderRadius: "0 0 25px 25px",
          marginBottom: "30px",
        }}
      >
        <img
          src={logo}
          alt="Neurobin"
          style={{ width: "70px", borderRadius: "50%", marginBottom: "10px" }}
        />
        <h1 style={{ margin: 0 }}>
          {isAdmin ? "Admin Panel" : "NeuroBin : Public Portal"}
        </h1>
        <p style={{ marginTop: "6px", fontSize: "14px" }}>
          {isAdmin
            ? "Monitor and manage waste system"
            : "Raise complaints and track status easily"}
        </p>
      </div>

      {/* 🔥 MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          margin: "0 auto",
          gap: "32px",
          maxWidth: "750px", // ✅ reduced width (clean look)
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{ marginBottom: "10px", color: "#0a0f1e" }}>
            {isAdmin ? "System Control Center" : "Welcome to NeuroBin"}
          </h2>

          <p style={{ color: "#6b7a8d", lineHeight: "1.6" }}>
            {isAdmin
              ? "Access dashboard, map, and complaint management tools."
              : "Help keep your city clean by reporting waste issues quickly."}
          </p>

          {!isAdmin && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "10px" }}>
              Admin features require login
            </p>
          )}
        </div>

        {/* RIGHT SIDE (CARDS) */}
<div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
  
  {/* Static Login for Authorities card */}
  <Link to="/login" style={{ textDecoration: "none" }}>
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: "700", fontSize: "15px", color: "#0a0f1e" }}>
          Login for Authorities
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b7a8d" }}>
          Access administrative controls
        </p>
      </div>
      <span style={{ fontSize: "18px" }}>→</span>
    </div>
  </Link>

  {navItems.map((item, i) => (
    <Link key={i} to={item.to} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: item.dark ? "#0a0f1e" : "#ffffff",
          borderRadius: "18px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: item.dark
            ? "0 4px 15px rgba(0,0,0,0.15)"
            : "0 4px 15px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "0.3s",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: "700",
              fontSize: "15px",
              color: item.dark ? "#ffffff" : "#0a0f1e",
            }}
          >
            {item.label}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "12px",
              color: item.dark ? "#8b9cb3" : "#6b7a8d",
            }}
          >
            {item.desc}
          </p>
        </div>
        <span style={{ fontSize: "18px" }}>→</span>
      </div>
    </Link>
  ))}
</div>
      </div>
    </div>
  );
}

export default HomePage;