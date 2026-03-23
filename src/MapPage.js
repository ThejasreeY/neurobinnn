import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";

// 🔥 Marker color
const getMarkerIcon = (level) => {
  let color =
    level > 70 ? "red" :
    level > 40 ? "orange" : "green";

  return new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32],
  });
};

// 🔥 ROUTING COMPONENT
function Routing({ adminLocation, selectedLat, selectedLng, setRouteInfo, setInstructions, darkMode }) {
  const map = useMap();
  const routingRef = useRef(null);
  

  useEffect(() => {
    if (!adminLocation || !selectedLat || !selectedLng) return;

    // Remove old route
    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    // Create new route
    const routing = L.Routing.control({
      waypoints: [
        L.latLng(adminLocation.lat, adminLocation.lng),
        L.latLng(selectedLat, selectedLng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      
      lineOptions: {
        styles: [
          {
            color:  "#ef4444",
            weight: 6,
            opacity: 0.9
          }
        ]
      }
      
    }).addTo(map);

    // Distance + ETA + Directions
    routing.on("routesfound", (e) => {
      const route = e.routes[0];

      const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
      const timeMin = (route.summary.totalTime / 60).toFixed(1);

      setRouteInfo({
        distance: distanceKm,
        time: timeMin
      });

      const steps = route.instructions.map((inst) => inst.text);
      setInstructions(steps);
    });

    routingRef.current = routing;

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
      }
    };

  }, [adminLocation, selectedLat, selectedLng, map]);

  return null;
}

function MapPage({ data, darkMode }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const selectedLat = parseFloat(params.get("lat"));
  const selectedLng = parseFloat(params.get("lng"));

  const bins = Object.values(data || {});
  const selectedBin = bins.find(
    (bin) =>
      bin.latitude === selectedLat &&
      bin.longitude === selectedLng
  );

  const [adminLocation, setAdminLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [instructions, setInstructions] = useState([]);

  // 📍 Live location
  useEffect(() => {
    if (!navigator.geolocation) {
      setAdminLocation({ lat: 13.0677, lng: 80.21634 });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setAdminLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        console.log("Location error:", err);

        // fallback
        setAdminLocation({
          lat: 13.0677,
          lng: 80.21634
        });
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={{
      background: darkMode ? "#0f172a" : "#f5f7fa",
      minHeight: "100vh",
      color: darkMode ? "#e2e8f0" : "#000"
    }}>

      {/* 🔥 HEADER */}
      <div style={{
        background: darkMode
          ? "linear-gradient(135deg, #1e293b, #0f172a)"
          : "linear-gradient(135deg, #26949296, #1cc2cb)",
        padding: "20px",
        textAlign: "center",
        color: "white",
        borderRadius: "0 0 20px 20px"
      }}>
        <h1>Bin Navigation</h1>
        <p>Live Route + Directions</p>
      </div>

      {/* 📊 Distance + ETA */}
      {routeInfo && (
        <div style={{
          background: darkMode ? "#1e293b" : "#ffffff",
          color: darkMode ? "#e2e8f0" : "#000",
          padding: "12px 20px",
          borderRadius: "12px",
          margin: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontWeight: "600"
        }}>
          <span>📏 {routeInfo.distance} km</span>
          <span>⏱ {routeInfo.time} min</span>
        </div>
      )}

      {/* 🧭 Directions */}
      {instructions.length > 0 && (
        <div style={{
          background: darkMode ? "#1e293b" : "#ffffff",
          color: darkMode ? "#cbd5f5" : "#444",
          margin: "10px 20px",
          padding: "15px",
          borderRadius: "12px",
          maxHeight: "200px",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          <h4>Directions</h4>
          {instructions.slice(0, 6).map((step, i) => (
            <p key={i}>👉 {step}</p>
          ))}
        </div>
      )}

      {/* 🗺 MAP */}
      <div style={{ padding: "20px" }}>
        <MapContainer
          center={
            selectedLat && selectedLng
              ? [selectedLat, selectedLng]
              : [13.0677, 80.21634]
          }
          zoom={13}
          style={{
            height: "70vh",
            width: "100%",
            borderRadius: "20px"
          }}
        >

          {/* 🌙 DARK / LIGHT MAP */}
          <TileLayer
            url={
              darkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            }
            subdomains={darkMode ? [] : ["mt0", "mt1", "mt2", "mt3"]}
          />

          {/* 🔥 ROUTE */}
          {adminLocation && selectedLat && selectedLng && (
            <Routing
              adminLocation={adminLocation}
              selectedLat={selectedLat}
              selectedLng={selectedLng}
              setRouteInfo={setRouteInfo}
              setInstructions={setInstructions}
              darkMode= {darkMode}
            />
          )}

          {/* 👨‍💼 ADMIN */}
          {adminLocation && (
            <Marker position={[adminLocation.lat, adminLocation.lng]}>
              <Popup>👨‍💼 You</Popup>
            </Marker>
          )}

          {/* 🗑 SELECTED BIN ONLY */}
          {selectedBin && (
            <Marker
              position={[selectedBin.latitude, selectedBin.longitude]}
              icon={getMarkerIcon(100 - selectedBin.distance1_cm)}
            >
              <Popup>🗑 Selected Bin</Popup>
            </Marker>
          )}

        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;