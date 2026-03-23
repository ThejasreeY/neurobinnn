import React, {useState, useEffect} from "react";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
function Dashboard({ data, hoverIndex, setHoverIndex, darkMode }) {
  const [adminLocation, setAdminLocation] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAdminLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.log("Location error:", error);
      }
    );
  }, []);
  return (
    <div style={{
      background: darkMode ? "#0f172a" : "#f5f7fa",
      minHeight: "100vh",
      transition: "0.3s"
    }}>

      {/* 🔥 HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #26949296, #1cc2cb)",
        padding: "25px",
        textAlign: "center",
        color: "white",
        borderRadius: "0 0 25px 25px",
        marginBottom: "30px"
      }}>
        <img 
          src={logo} 
          alt="NeuroBin Logo" 
          style={{ width: "60px", borderRadius: "50%", marginBottom: "10px" }} 
        />
        <h1 style={{ margin: 0 }}>NeuroBin Dashboard</h1>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Smart Waste Monitoring System
        </p>

        <p style={{ marginTop: "8px", fontSize: "13px" }}>
          Live Data Updating...
        </p>
      </div>

      {/* 🔥 CARDS */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        flexWrap: "wrap",
        padding: "20px"
      }}>
        {data &&
          Object.values(data)
            .slice(-2)
            .map((item, index) => {

              const level = 100 - item.distance1_cm;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  style={{
                    width: "260px",
                    background: darkMode ? "#1e293b" : "#ffffff",
                    borderRadius: "18px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: darkMode ? "1px solid #334155" : "1px solid #f0f0f0",
                    transform: hoverIndex === index
                      ? "translateY(-6px) scale(1.04)"
                      : "scale(1)",
                    boxShadow:
                      hoverIndex === index
                        ? "0 14px 35px rgba(0,0,0,0.25)"
                        : "0 6px 18px rgba(0,0,0,0.15)"
                  }}
                >
                  {/* BIN TITLE */}
                  <h3 style={{
                    marginBottom: "10px",
                    color: darkMode ? "#e2e8f0" : "#333"
                  }}>
                    🗑️ Smart Bin #{index + 1}
                  </h3>

                  {/* LEVEL */}
                  <h1 style={{
                    fontSize: "32px",
                    margin: "10px 0",
                    color:
                      level > 70 ? "#ef4444" :
                      level > 40 ? "#f59e0b" : "#22c55e"
                  }}>
                    {level.toFixed(2)}%
                  </h1>

                  {/* PROGRESS BAR */}
                  <div style={{
                    height: "12px",
                    background: darkMode ? "#334155" : "#eee",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "10px"
                  }}>
                    <div style={{
                      width: `${level}%`,
                      height: "100%",
                      background:
                        level > 70 ? "#ef4444" :
                        level > 40 ? "#f59e0b" : "#22c55e",
                      transition: "0.4s"
                    }}></div>
                  </div>

                  {/* STATUS */}
                  <p style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                    color:
                      level > 70 ? "#ef4444" :
                      level > 40 ? "#f59e0b" : "#22c55e"
                  }}>
                    {level > 70 ? "Full" : level > 40 ? "Medium" : "Empty"}
                  </p>

                  {/* LOCATION */}
                  <p style={{
                    fontSize: "12px",
                    color: darkMode ? "#94a3b8" : "#777"
                  }}>
                    📍 {item.latitude}, {item.longitude}
                  </p>
                  {/* NAVIGATE BUTTON */}
                  <button
                    onClick={() => {
                        navigate(`/map?lat=${item.latitude}&lng=${item.longitude}`);
                      }}
                    style={{
                      marginTop: "12px",
                      padding: "8px 14px",
                      background: "linear-gradient(135deg, #00c3ff, #4b326e)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600"
                      
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                    onMouseLeave={(e) => e.target.style.opacity = "1"}
                  >
                     Navigate
                     
                  </button>
                </div>
              );
            })}
      </div>

      {/* ⏱ LAST UPDATED */}
      <p style={{
        textAlign: "center",
        marginTop: "30px",
        fontSize: "12px",
        color: darkMode ? "#94a3b8" : "#888"
      }}>
        Last Updated: {new Date().toLocaleTimeString()}
      </p>

    </div>
  );
}

export default Dashboard;