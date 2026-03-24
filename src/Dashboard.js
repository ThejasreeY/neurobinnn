import React from "react";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";

function Dashboard({ data, hoverIndex, setHoverIndex, darkMode }) {
  const navigate = useNavigate();

  return (
    <div style={{
      background: darkMode ? "#0f172a" : "#f5f7fa",
      minHeight: "100vh",
      transition: "0.3s"
    }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #26949296, #1cc2cb)",
        padding: "25px",
        textAlign: "center",
        color: "white",
        borderRadius: "0 0 25px 25px",
        marginBottom: "30px"
      }}>
        <img src={logo} alt="NeuroBin" style={{ width: "60px", borderRadius: "50%" }} />
        <h1>NeuroBin Dashboard</h1>
        <p>Smart Waste Monitoring System</p>
      </div>

      {/* BIN CARDS */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        flexWrap: "wrap",
        padding: "20px"
      }}>
        {data &&
          Object.values(data).slice(-2).map((item, index) => {

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
                  transition: "0.3s"
                }}
              >
                <h3>🗑️ Bin #{index + 1}</h3>

                <h1 style={{
                  color:
                    level > 70 ? "#ef4444" :
                    level > 40 ? "#f59e0b" : "#22c55e"
                }}>
                  {level.toFixed(2)}%
                </h1>

                <button
                  onClick={() =>
                    navigate(`/map?lat=${item.latitude}&lng=${item.longitude}`)
                  }
                  style={{
                    padding: "8px 14px",
                    background: "#4facfe",
                    color: "white",
                    border: "none",
                    borderRadius: "8px"
                  }}
                >
                  Navigate
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;