declare global {
  interface Window {
    mapboxMap?: mapboxgl.Map;
    selectedSensors?: string[];
  }
}

export default function Viewsetter() {
  const box_style =
    "font-mono uppercase box-border p-2 shadow-lg rounded-xl text-center max-w-100 text-white z-5 cursor-pointer text-xs w-45 hover:bg-amber-800 hover:scale-103 transition-transform duration-200";
  return (
    <div className="hidden md:flex absolute bottom-5 left-5 flex-row gap-3 box-border p-2 shadow-lg rounded-lg z-5 bg-radial from-gray-100/30 from-20% to-gray-100/50 backdrop-blur-sm">
      <div
        className={box_style + " bg-blue-950"}
        onClick={() => {
          if (window.mapboxMap) {
            window.mapboxMap.flyTo({ center: [-87.8, 21.5], zoom: 10 });
          }
        }}
      >
        Ria Lagartos
      </div>
      <div
        className={box_style + " bg-purple-950"}
        onClick={() => {
          if (window.mapboxMap) {
            window.mapboxMap.flyTo({ center: [-105.45, 22.05], zoom: 10 });
          }
        }}
      >
        Marismas Nacionales
      </div>
    </div>
  );
}
