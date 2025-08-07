import Image from "next/image";
import { createMarkers } from "./marker_load";
import { sensorTypes } from "./sensor_types";

declare global {
  interface Window {
    mapboxMap?: mapboxgl.Map;
    selectedSensors?: string[];
  }
}

export default function Sidebar() {
  const categories = sensorTypes;
  return (
    <div className="font-mono absolute top-5 right-5 box-border p-2 md:p-4 shadow-lg rounded-full md:rounded-xl max-w-100 text-black z-5 bg-radial from-gray-100/80 from-20% to-gray-100/90 backdrop-blur-sm">
      <div className="hidden md:block">
        <h2 className="text-4xl font-sans uppercase">ManglarIA</h2>
        <hr/>
        <p className="tracking-widest text-sm font-mono">SENSOR INVENTORY /////</p>
        <br />
      </div>
      <div>
        {categories.map((category, index) => (
          <div key={index} className="text-black pb-2 select-none capitalize">
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
                    ? "cursor-pointer text-black hover:text-purple-800"
                    : "cursor-pointer text-gray-400 line-through hover:text-gray-500 grayscale";
                }
              }}
            />
            <label
              htmlFor={`category-${index}`}
              className="cursor-pointer text-black hover:text-purple-800"
            >
              <Image
                src={`/sensor-icons/${category.toLowerCase().replace(/\s+/g, "-")}.png`}
                alt={`${category} Icon`}
                width={24}
                height={24}
                className="inline-block"
              />
              <span className="ml-2 hidden md:inline-block">{category}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <p className="mt-2 text-sm text-gray-400">[click to explore]</p>
        <br />
        <details className=" text-gray-500">
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
            <br />
            dashboard v0.1.2 by{" "}
            <a
              href="https://github.com/knosmos"
              className="text-purple-800 hover:underline"
            >
              jieruei chang
            </a>
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
            <hr />
            <br />
            <div className="flex justify-stretch items-center space-x-4 mt-2 w-full">
              <Image src="/wwf.svg" alt="WWF Logo" width={30} height={20} />
              <div className="border-l border-gray-300 h-6"></div>
              <Image
                src="/google_org.png"
                alt="Google.org Logo"
                width={120}
                height={20}
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
