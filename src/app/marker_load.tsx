import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./markers.css";
import * as Papa from "papaparse";
import { Polyline } from "./polyline";

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
    .then((response) => response.text())
    .then((data) =>
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
      }),
    );
}

export async function createMarkers() {
  if (window.mapboxMap) {
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
    existingMarkers.forEach((marker) => marker.remove());
    if (window.sensorLines) {
      window.sensorLines.forEach((line) => line.remove());
      window.sensorLines = [];
    }
  }
  const data = await fetchCSVData();
  console.log(data);
  const markers: mapboxgl.Marker[] = [];
  for (const sensor of data.data as SensorData[]) {
    if (sensor.Sensor === "Dron Lidar") {
      sensor.Sensor = "Drone Lidar"; // Correcting sensor name for consistency
    }
    if (
      window.selectedSensors &&
      !window.selectedSensors.includes(sensor.Sensor.toLowerCase())
    ) {
      console.log(`Skipping sensor: ${sensor.Sensor} (not selected)`);
      continue;
    }
    const lat: number = parseFloat(sensor.Latitude);
    const lng: number = parseFloat(sensor.Longitude);
    if (isNaN(lat) || isNaN(lng)) {
      console.warn(
        `Invalid coordinates for sensor: ${sensor.Latitude}, ${sensor.Longitude}`,
      );
      continue;
    } else {
      console.log(`Adding marker at: ${lat}, ${lng}`);
    }
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    }).setMaxWidth("100%").setHTML(`
        <div class="font-mono text-black">
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
        </div>`);
    const el = document.createElement("div");
    el.className =
      "w-10 h-10 rounded-full shadow-lg cursor-pointer bg-size-[100%] block border-none z-1";
    const icon_name: string = sensor.Sensor.toLowerCase().replace(/\s+/g, "-");
    el.style.backgroundImage = `url(sensor-icons/${icon_name}.png)`;
    markers.push(
      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(window.mapboxMap as mapboxgl.Map),
    );
  }
  // detect if markers are in same location and group them
  const markerLocations: { [key: string]: mapboxgl.Marker[] } = {};
  markers.forEach((marker) => {
    // const position = marker.getLngLat().toString();
    const position = marker.getLngLat().toString();
    if (!markerLocations[position]) {
      markerLocations[position] = [];
    }
    markerLocations[position].push(marker);
  });
  // cluster markers that are close together
  // for (const marker of markers) {
  //     const lnglat = marker.getLngLat();
  //     let matchFound = false;
  //     for (const position in markerLocations) {
  //         const [lng, lat] = position.split(",").map(Number);
  //         const distance = Math.sqrt(
  //             Math.pow(lng - lnglat.lng, 2) + Math.pow(lat - lnglat.lat, 2),
  //         );
  //         if (distance < 0.0001) {
  //             markerLocations[position].push(marker);
  //             matchFound = true;
  //             break;
  //         }
  //     }
  //     // if no close position found, add to new position
  //     if (!matchFound) {
  //         markerLocations[`${lnglat.lng.toFixed(6)},${lnglat.lat.toFixed(6)}`] = [marker];
  //     }
  // }
  for (const position in markerLocations) {
    if (markerLocations[position].length > 1) {
      const markersAtPosition = markerLocations[position];
      const markerLngLat = markersAtPosition[0].getLngLat();
      const r = 0.0001; // small radius to shift markers
      const theta_delta = (2 * Math.PI) / markersAtPosition.length;
      markersAtPosition.forEach((marker, index) => {
        const lngLat = marker.getLngLat();
        const newLng = lngLat.lng + r * Math.cos(index * theta_delta);
        const newLat = lngLat.lat + r * Math.sin(index * theta_delta);
        marker.setLngLat([newLng, newLat]);
        // draw a line to the original position
        const line = new Polyline({
          id: `line-${position}-${index}`,
          points: [
            [lngLat.lng, lngLat.lat],
            [newLng, newLat],
          ],
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ddd",
            "line-width": 1.5,
          },
        });
        line.addTo(window.mapboxMap as mapboxgl.Map);
        if (!window.sensorLines) {
          window.sensorLines = [];
        }
        window.sensorLines.push(line);
      });
      // add circle at original position
      const circle_el = document.createElement("div");
      circle_el.className =
        "w-3 h-3 rounded-full shadow-lg cursor-pointer bg-size-[100%] block border-none bg-gray-300 z-0";
      const circle = new mapboxgl.Marker(circle_el)
        .setLngLat(markerLngLat)
        .addTo(window.mapboxMap as mapboxgl.Map)
        .setPopup(
          new mapboxgl.Popup({ closeButton: false }).setHTML(
            `<div class="font-mono text-black">Multiple sensors at this location</div>`,
          ),
        );
      markers.push(circle);
    }
  }
  window.sensorMarkers = markers;
}
