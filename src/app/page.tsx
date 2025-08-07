"use client";

import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Sidebar from "./sidebar";
import { Polyline } from "./polyline";
import { sensorTypes } from "./sensor_types";
import { createMarkers } from "./marker_load";
import { create } from "domain";
import Viewsetter from "./viewsetter";
import SplashScreen from "./splash";

declare global {
  interface Window {
    mapboxMap?: mapboxgl.Map;
    selectedSensors?: string[];
    sensorMarkers?: mapboxgl.Marker[];
    sensorLines?: Polyline[];
  }
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const center: [number, number] = [-105.45, 22.05]; // CHANGE TO SET MAP INITIAL LOCATION

const Map = () => {
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.selectedSensors =
        window.selectedSensors || sensorTypes.map((type) => type.toLowerCase());
      const map_object = new mapboxgl.Map({
        container: "map",
        style: // CHANGE TO SET MAP STYLE
          "mapbox://styles/jieruei/cmdqg6l5i024g01sadq52c3cb?optimize=true",
        center: center,
        zoom: 10,
      });
      mapRef.current = map_object;
      window.mapboxMap = map_object;
      map_object.on("load", async () => {
        createMarkers();
      });
    }
  }, []);
  return (
    <div>
      <SplashScreen />
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      <Sidebar />
      <Viewsetter />
    </div>
  );
};

export default function Home() {
  return <Map />;
}
