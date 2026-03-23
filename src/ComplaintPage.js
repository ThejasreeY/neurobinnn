import { ref, push, onValue, update } from "firebase/database";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";

function getInitials(name) {
 if (!name) return "?";  
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ComplaintCard({ complaint, complaintId, markResolved }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  
  if (!complaint || !complaint.name) return null;
  
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "18px",
      padding: "18px",
      marginBottom: "16px",
      border: "1px solid #f0f0f0",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      transition: "0.3s",
    }}>
      {/* Card Header */}
      <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
          borderBottom: "1px solid #f2f2f2",
          paddingBottom: "10px"
        }}>
        {/* Avatar */}
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "#e6f1fb", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "13px", fontWeight: "500",
          color: "#185fa5", flexShrink: 0,
        }}>
          {getInitials(complaint.name)}
        </div>

        {/* Name & Time */}
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 2px", fontWeight: "500", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {complaint.name}
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
            {complaint.time}
          </p>
        </div>

        {/* Status Badge */}
        <span style={{
            fontSize: "11px",
            padding: "5px 12px",
            borderRadius: "20px",
            fontWeight: "600",
            background:
              complaint.status === "Resolved" ? "#e6f7ec" : "#fff4e5",
            color:
              complaint.status === "Resolved" ? "#2e7d32" : "#b26a00",
          }}>
          {complaint.status}
        </span>
      </div>
      {/* Bin ID */}
      <p style={{
        fontSize: "13px",
        color: "#777",
        marginBottom: "5px"
        }}>
        🗑️ {complaint.binId || "Not specified"}
      </p>


      {/* Issue Text */}
      <p style={{
        margin: 0, fontSize: "14px", color: "#555", lineHeight: "1.6",
        borderTop: "0.5px solid #e0e0e0", paddingTop: "10px",
      }}>
        {complaint.issue}
      </p>
       

      <button
        onClick={() => {
          window.location.href = `/map?lat=${complaint.latitude}&lng=${complaint.longitude}`;
        }}
        style={{
          marginTop: "12px",
          padding: "8px 14px",
          background: "#4facfe",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
          marginRight: "8px"
        }}
      >
         View Map
      </button>
      {isAdmin && complaint.status !== "Resolved" && (
        <button
          onClick={() => markResolved(complaintId)}
          style={{
            marginTop: "12px",
            padding: "8px 14px",
            background: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500"
          }}
        >
          Resolve
        </button>
      )}
    </div>
  );
}

function ComplaintPage() {
  const [filter, setFilter] = useState("All");
  const [complaints, setComplaints] = useState({});
  const [name, setName] = useState("");
  const [issue, setIssue] = useState("");
  const [binId, setBinId] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
  const dbRef = ref(db, "waste_bins");  // read bin data

  onValue(dbRef, (snapshot) => {
    setData(snapshot.val() || {});
  });
  }, []);
  const binsArray = Object.entries(data || {});

  // sort by key (Firebase keys are time-based)
  binsArray.sort((a, b) => a[0].localeCompare(b[0]));

  const latestBin = binsArray.length > 0 
    ? binsArray[binsArray.length - 1][1] 
    : null;

  const selectedLat = latestBin?.latitude || 13.0677;
  const selectedLng = latestBin?.longitude || 80.21634;
  
  useEffect(() => {
    const complaintRef = ref(db, "Complaint");
    onValue(complaintRef, (snapshot) => {
      setComplaints(snapshot.val() || {});
    });
  }, []);

  const handleSubmit = (e) => {
  e.preventDefault();

  console.log("Submitting:", name, issue); // ✅ DEBUG

  const complaintRef = ref(db, "Complaint");

  push(complaintRef, {
    name,
    issue,
    binId,
    latitude: selectedLat,
    longitude: selectedLng,
    time: new Date().toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    }),
    status: "Pending",
    
  })
  .then(() => {
    console.log("Data sent to Firebase");
    alert("Complaint submitted!");
  })
  .catch((err) => {
    console.error("Error:", err);
  });
  if (!selectedLat || !selectedLng) {
  alert("Location not available yet. Please try again.");
  return;
  }
  console.log("Latest Bin:", latestBin);
  console.log("Lat:", selectedLat, "Lng:", selectedLng);
  setName("");
  setIssue("");
};

  const markResolved = (id) => {
    const complaintRef = ref(db, `Complaint/${id}`);
    update(complaintRef, {
      status: "Resolved",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{
          background: "linear-gradient(135deg, #26949296, #1cc2cb)",
          padding: "25px",
          textAlign: "center",
          color: "white",
          borderRadius: "0 0 25px 25px",
          marginBottom: "30px"
        }}>
          <h1 style={{ margin: 0 }}>Complaint Portal</h1>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Raise and Track Waste Issues
          </p>
        </div>

      <form onSubmit={handleSubmit} style={{
          maxWidth: "400px",
          margin: "0 auto 32px",
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
        }}>
        <input
          type="text" placeholder="Your Name" value={name}
          onChange={(e) => setName(e.target.value)} required
          style={{ width: "100%", margin: "10px 0", padding: "10px", boxSizing: "border-box" }}
        />
        <input
          type="text"
          placeholder="Bin ID (e.g. Bin 1)"
          value={binId}
          onChange={(e) => setBinId(e.target.value)}
          style={{ width: "100%", margin: "10px 0", padding: "10px" , boxSizing: "border-box"}}
        />
        <textarea
          placeholder="Describe your issue" value={issue}
          onChange={(e) => setIssue(e.target.value)} required
          style={{ width: "100%", margin: "10px 0", padding: "10px", boxSizing: "border-box" }}
        />
       
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="submit"
            style={{
              padding: "10px 25px",
              background: "linear-gradient(135deg, #26949296, #0acaf1)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Submit
          </button>
        </div>
      </form>

      <div style={{ marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px" 
      }}>
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
        <button onClick={() => setFilter("Resolved")}>Resolved</button>
      </div>

      <h2>Complaints</h2>

      {Object.keys(complaints).length === 0 ? (
        <p style={{ color: "#888" }}>No complaints yet.</p>
      ) : (
                Object.entries(complaints)
          .filter(([id, c]) => filter === "All" || c.status === filter)
          .reverse()
          .map(([id, c]) => (
            <ComplaintCard
              key={id}
              complaint={c}
              complaintId={id}
              markResolved={markResolved}
            />
        ))
        
      )}
    </div>
  );
}

export default ComplaintPage;