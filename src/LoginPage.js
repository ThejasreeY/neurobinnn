import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from  "./assets/logo.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@domain.com" && password === "1234") {
      localStorage.setItem("isAdmin", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px 32px",
        borderRadius: "20px",
        width: "320px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
      }}>

        {/* Logo */}
        
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 12px",
                background: "#e8f5e9",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #c8e6c9"
            }}>
                <img
                src={logo}
                alt="Logo"
                style={{
                    width: "55px",
                    height: "95px",
                    objectFit: "contain",
                    display: "block"
                }}
                />
            </div>

          <h1 style={{
            fontSize: "26px",
            fontWeight: "800",
            letterSpacing: "2px",
            color: "#0f172a",
            margin: "0 0 4px"
          }}>LOGIN</h1>

          <p style={{
            fontSize: "9px",
            fontWeight: "700",
            letterSpacing: "3px",
            color: "#94a3b8",
            margin: 0,
            textTransform: "uppercase"
          }}>Access Command Center</p>
        </div>

        <form onSubmit={handleLogin} style={{ marginTop: "28px" }}>

          {/* Email Field */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              color: "#64748b",
              textTransform: "uppercase",
              marginBottom: "6px"
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                fontSize: "14px",
                color: "#0f172a",
                background: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2e7d32"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              color: "#64748b",
              textTransform: "uppercase",
              marginBottom: "6px"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                fontSize: "14px",
                color: "#0f172a",
                background: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2e7d32"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#0f172a",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s, transform 0.1s"
            }}
            onMouseEnter={(e) => e.target.style.background = "#1e293b"}
            onMouseLeave={(e) => e.target.style.background = "#0f172a"}
            onMouseDown={(e) => e.target.style.transform = "scale(0.98)"}
            onMouseUp={(e) => e.target.style.transform = "scale(1)"}
          >
            Confirm Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;