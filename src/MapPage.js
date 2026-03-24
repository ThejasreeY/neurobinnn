import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";

// 🔥 ROUTING COMPONENT
function Routing({
  adminLocation,
  selectedLat,
  selectedLng,
  setRouteInfo,
  setInstructions
}) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!adminLocation || selectedLat === null || selectedLng === null) return;

    // Remove previous route
    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    const routing = L.Routing.control({
      waypoints: [
        L.latLng(adminLocation.lat, adminLocation.lng),
        L.latLng(selectedLat, selectedLng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,

      // 🔥 Thicker route line
      lineOptions: {
        styles: [
          {
            color: "#ef4444",
            weight: 6,
            opacity: 0.9
          }
        ]
      }
    }).addTo(map);

    // 📊 Distance + Time + Steps
    routing.on("routesfound", (e) => {
      const route = e.routes[0];

      setRouteInfo({
        distance: (route.summary.totalDistance / 1000).toFixed(2),
        time: (route.summary.totalTime / 60).toFixed(1)
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
  }, [adminLocation, selectedLat, selectedLng, map, setRouteInfo, setInstructions]);

  return null;
}

// 🔥 MAIN COMPONENT
function MapPage({ data, darkMode }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // ✅ Safe URL parsing
  const latParam = params.get("lat");
  const lngParam = params.get("lng");

  const selectedLat = latParam ? parseFloat(latParam) : null;
  const selectedLng = lngParam ? parseFloat(lngParam) : null;

  const [adminLocation, setAdminLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [instructions, setInstructions] = useState([]);

  // 📍 Get Admin Location (Live)
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
      () => {
        // fallback (Chennai)
        setAdminLocation({ lat: 13.0677, lng: 80.21634 });
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div
      style={{
        background: darkMode ? "#0f172a" : "linear-gradient(135deg, #82b3b296, #1cc2cb)",
        minHeight: "100vh",
        color: darkMode ? "#61a3f9" : "#000"
      }}
    >
      {/* HEADER */}
      <h2 style={{ textAlign: "center", paddingTop: "10px" }}>
        Bin Navigation
      </h2>

      {/* 📊 ROUTE INFO */}
      {routeInfo && (
        <div style={{ textAlign: "center", fontWeight: "600" }}>
          📏 {routeInfo.distance} km | ⏱ {routeInfo.time} min
        </div>
      )}

      {/* 🧭 DIRECTIONS */}
      {instructions.length > 0 && (
        <div
          style={{
            margin: "10px auto",
            maxWidth: "400px",
            background: darkMode ? "#1e293b" : "#fff",
            padding: "10px",
            borderRadius: "10px",
            fontSize: "13px"
          }}
        >
          {instructions.slice(0, 5).map((step, i) => (
            <p key={i}>👉 {step}</p>
          ))}
        </div>
      )}

      {/* 🗺 MAP */}
      <MapContainer
        center={
          selectedLat !== null && selectedLng !== null
            ? [selectedLat, selectedLng]
            : adminLocation?.lat && adminLocation?.lng
            ? [adminLocation.lat, adminLocation.lng]
            : [13.0677, 80.21634]
        }
        zoom={13}
        style={{
          height: "70vh",
          margin: "20px",
          borderRadius: "15px"
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

        {/* 🔥 ROUTING */}
        {adminLocation &&
          selectedLat !== null &&
          selectedLng !== null && (
            <Routing
              adminLocation={adminLocation}
              selectedLat={selectedLat}
              selectedLng={selectedLng}
              setRouteInfo={setRouteInfo}
              setInstructions={setInstructions}
            />
          )}

        {/* 👨‍💼 ADMIN MARKER */}
        {adminLocation?.lat && adminLocation?.lng && (
          <Marker position={[adminLocation.lat, adminLocation.lng]}>
            <Popup>👨‍💼 You</Popup>
          </Marker>
        )}

        {/* 🗑 BIN MARKER */}
        {selectedLat !== null && selectedLng !== null && (
          <Marker position={[selectedLat, selectedLng]}>
            <Popup>🗑 Selected Bin</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default MapPage;