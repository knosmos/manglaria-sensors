import Image from "next/image";
import { createMarkers } from "./marker_load";

declare global {
  interface Window {
    mapboxMap?: mapboxgl.Map;
    selectedSensors?: string[];
  }
}

export default function Sidebar() {
  const categories = [
    "Current Profiler",
    "Drone Lidar",
    "Flux Tower",
    "Forest Survey",
    "Soil Sample",
    "Terrestrial Camera",
    "Underwater Datalogger",
    "Weather Station",
  ];
  return (
    <div className="font-mono absolute top-5 right-5 box-border bg-gray-200 p-4 shadow-lg rounded-lg max-w-100">
      <h2 className="text-3xl font-bold font-sans tracking-tight">ManglarIA</h2>
      <hr />
      <p className="tracking-widest text-sm">SENSOR INVENTORY /////</p>
      <br />
      <div>
        {categories.map((category, index) => (
          <div key={index} className="text-black pb-2">
            <input
              type="checkbox"
              className="hidden"
              id={`category-${index}`}
              name={category.toLowerCase().replace(/\s+/g, "-")}
              defaultChecked={true}
              onChange={(e) => {
                const selected = window.selectedSensors || [];
                if (e.target.checked) {
                  selected.push(category.toLowerCase());
                } else {
                  const index = selected.indexOf(category.toLowerCase());
                  if (index > -1) {
                    selected.splice(index, 1);
                  }
                }
                window.selectedSensors = selected;
                createMarkers();
                const label = document.querySelector(
                  `label[for="category-${index}"]`,
                );
                if (label) {
                  label.className = e.target.checked
                    ? "cursor-pointer text-black hover:line-through"
                    : "cursor-pointer text-gray-400 line-through hover:no-underline hover:text-gray-500";
                }
              }}
            />
            <label
              htmlFor={`category-${index}`}
              className="cursor-pointer hover:line-through"
            >
              <Image
                src={`/sensor-icons/${category.toLowerCase().replace(/\s+/g, "-")}.png`}
                alt={`${category} Icon`}
                width={24}
                height={24}
                className="inline-block mr-2"
              />
              {category}
            </label>
          </div>
        ))}
      </div>
      <br />
      <details className="text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">About</summary>
        <div className="text-sm">
          <br />
          <a
            className="text-purple-800 hover:underline"
            href="https://www.worldwildlife.org/projects/manglaria-using-artificial-intelligence-to-save-mangroves-in-a-changing-climate"
          >
            ManglarIA
          </a>
          : Using artificial intelligence to save mangroves in a changing
          climate
          <hr />
          <br />
          dashboard v0.0.2
          <br />
          by jieruei chang
          <br />
          built with{" "}
          <a
            href="https://nextjs.org/"
            className="text-purple-800 hover:underline"
          >
            Next.js
          </a>{" "}
          and{" "}
          <a
            href="https://mapbox.com/"
            className="text-purple-800 hover:underline"
          >
            Mapbox
          </a>
        </div>
      </details>
    </div>
  );
}
