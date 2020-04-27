import React, { Component, useState, useEffect, useRef } from "react";
import "./App.css";
import L from "leaflet";
import userLocation from "./marker.png";
import { Map, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import Navigation from "./Components/Navigation/Navigation.js";
import Welcome from "./Components/Welcome/Welcome.js";

function App() {
  const [message, setMessage] = useState(
    ">REV002096113686+1101831-0748084000022732;ID=SyrusG4<"
  );

  const [historic, setHistoric] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [color, setColor] = useState("black");
  const [dateNow, setDateNow] = useState(new Date(Date.now()).getTime());
  const [welcomeParty, setWelcomeParty] = useState(true);

  useEffect(() => {
    getInfo();
    const timer = setInterval(() => {
      getInfo();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setColor(color === "blue" ? "black" : "blue");
    console.log(historic);
  }, [historic]);

  const getInfo = () => {
    fetch("http://ec2-54-172-1-171.compute-1.amazonaws.com:5000/coords")
      .then((res) => res.json())
      .then((data) => {
        let { data1 } = data;

        if (historic.toString() !== data1.toString()) {
          setHistoric(data1);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vw",
      }}
    >
      <Navigation />

      <Welcome />
      <div className="claseUno">
        <div style={{ color: color, fontWeight: "bolder" }}>{message}</div>
        <div style={{ color: color, fontWeight: "bolder" }}>
          Latitud:{" "}
          {historic.length > 0 && historic[historic.length - 1].latitud}
        </div>
        <div style={{ color: color, fontWeight: "bolder" }}>
          Longitud:{" "}
          {historic.length > 0 && historic[historic.length - 1].longitud}
        </div>
        <div style={{ color: color, fontWeight: "bolder" }}>
          Fecha y Hora:{" "}
          {historic.length > 0 && historic[historic.length - 1].date}
        </div>
      </div>
      <div className="dive">
        <Map
          className="map"
          center={[
            historic.length > 0 && historic[historic.length - 1].latitud,
            historic.length > 0 && historic[historic.length - 1].longitud,
          ]}
          zoom={zoom}
          onZoomEnd={(e) => {
            setZoom(e.target._zoom);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[
              historic.length > 0 && historic[historic.length - 1].latitud,
              historic.length > 0 && historic[historic.length - 1].longitud,
            ]}
            icon={L.icon({
              iconUrl: userLocation,
              iconSize: [40, 40],
            })}
          >
            <Polyline
              positions={
                historic.length > 0 && [
                  historic
                    .filter((ele) => dateNow < new Date(ele.date).getTime())
                    .map((ele) => {
                      return [ele.latitud, ele.longitud];
                    }),
                ]
              }
            />
            <Popup>
              Latitud:{" "}
              {historic.length > 0 && historic[historic.length - 1].latitud}{" "}
              <br /> Longitud:{" "}
              {historic.length > 0 && historic[historic.length - 1].longitud}
            </Popup>
          </Marker>
        </Map>
      </div>
    </div>
  );
}

export default App;