"use client";

import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Sidebar from "./sidebar";
import { Polyline } from "./polyline";
import { createMarkers } from "./marker_load";
import { create } from "domain";
import Viewsetter from "./viewsetter";

declare global {
  interface Window {
    mapboxMap?: mapboxgl.Map;
    selectedSensors?: string[];
    sensorMarkers?: mapboxgl.Marker[];
    sensorLines?: Polyline[];
  }
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const center: [number, number] = [-87.8, 21.5];

const Map = () => {
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.selectedSensors = window.selectedSensors || [
        "current profiler",
        "drone lidar",
        "flux tower",
        "forest survey",
        "soil sample",
        "terrestrial camera",
        "underwater datalogger",
        "weather station",
      ];
      const map_object = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-v9",
        center: center,
        zoom: 10,
      });
      mapRef.current = map_object;
      window.mapboxMap = map_object; // Expose map object globally for debugging
      map_object.on("load", async () => {
        createMarkers();
      });
    }
  }, []);
  return (
    <div>
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      <Sidebar />
      <Viewsetter />
    </div>
  );
};

export default function Home() {
  return <Map />;
}
