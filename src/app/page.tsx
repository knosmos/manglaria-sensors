'use client';

import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as Papa from "papaparse";

import Sidebar from "./sidebar";
import { create } from "domain";

declare global {
  interface Window {
    mapboxMap?: mapboxgl.Map;
    selectedSensors?: string[];
  }
}

mapboxgl.accessToken = "pk.eyJ1IjoiamllcnVlaSIsImEiOiJjbWE2NnUwOTQwcDcyMmtxOWhiMmc1MXd2In0.YMFp5MSoXxY5L7_2yy_UsQ";
const center: [number, number] = [-87.8, 21.5];

type SensorData = {
  Latitude: string;
  Longitude: string;
  ANP: string;
  Location: string;
  Manufacturer: string;
  Model: string;
  Sensor: string;
  "Site code": string;
  "Installation date": string;
  "Installation status": string;
};

function fetchCSVData() {
  return fetch("/sensor_coords.csv")
    .then(response => response.text())
    .then(data => Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    }));
}

export async function createMarkers() {
  if (window.mapboxMap) {
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());
  }
  const data = await fetchCSVData();
  console.log(data);
  for (const sensor of data.data as SensorData[]) {
    if (sensor.Sensor === "Dron Lidar") {
      sensor.Sensor = "Drone Lidar"; // Correcting sensor name for consistency
    }
    if (window.selectedSensors && !window.selectedSensors.includes(sensor.Sensor.toLowerCase())) {
      console.log(`Skipping sensor: ${sensor.Sensor} (not selected)`);
      continue;
    }
    const lat : number = parseFloat(sensor.Latitude);
    const lng : number = parseFloat(sensor.Longitude);
    if (isNaN(lat) || isNaN(lng)) {
      console.warn(`Invalid coordinates for sensor: ${sensor.Latitude}, ${sensor.Longitude}`);
      continue;
    }
    else {
      console.log(`Adding marker at: ${lat}, ${lng}`);
    }
    const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
      .setMaxWidth("100%")
      .setHTML(`
        <div class="font-mono">
          <h2 class="text-lg uppercase"><b>${sensor.Sensor}</b></h2>
          <h3 class="font-mono text-lg">${sensor["Site code"]}</h3>
          <hr>
          <p class="uppercase tracking-widest">${sensor.Location} /////</p>
          <br>
          <table class="w-full">
            <tr>
              <td class="text-gray-500 pr-2">ANP:</td>
              <td class="text-gray-700">${sensor.ANP}</td>
            </tr>
            <tr>
              <td class="text-gray-500 pr-2">Manufacturer:</td>
              <td class="text-gray-700">${sensor.Manufacturer}</td>
            </tr>
            <tr>
              <td class="text-gray-500 pr-2">Model:</td>
              <td class="text-gray-700">${sensor.Model}</td>
            </tr>
            <tr>
              <td class="text-gray-500 pr-2">Installation Date:</td>
              <td class="text-gray-700">${sensor["Installation date"]}</td>
            </tr>
            <!--<tr>
              <td class="text-gray-500 pr-2">Installation Status:</td>
              <td class="text-gray-700">${sensor["Installation status"]}</td>
            </tr>-->
          </table>
          <br>
          <p class="text-gray-400">(${lat}, ${lng})</p>
        </div>`
      );
    const el = document.createElement('div');
    el.className = "w-10 h-10 rounded-full shadow-lg cursor-pointer";
    el.style.backgroundSize = '100%';
    el.style.display = 'block';
    el.style.border = 'none';
    const icon_name : string = sensor.Sensor.toLowerCase().replace(/\s+/g, "-");
    el.style.backgroundImage = `url(sensor-icons/${icon_name}.png)`;
    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(window.mapboxMap as mapboxgl.Map);
  }
}

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
        "weather station"
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
      <div id="map" style={{ width: "100%", height: "100vh" }}>
      </div>
      <Sidebar />
    </div>
  )
}

export default function Home() {
  return (
    <Map />
  );
}
