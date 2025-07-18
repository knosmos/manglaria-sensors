export interface IPolylineProps {
  id: string;
  points: Array<[number, number] | { lat: number; lng: number }>;
  layout?: mapboxgl.LineLayout;
  paint?: mapboxgl.LinePaint;
}

export class Polyline {
  constructor(private props: IPolylineProps) {}

  protected map: mapboxgl.Map | undefined;

  public addTo(map: mapboxgl.Map) {
    if (this.map) {
      this.remove();
    }
    this.map = map;
    map.addLayer({
      id: this.props.id,
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: this.props.points.map((point) => {
              return Array.isArray(point) ? point : [point.lng, point.lat];
            }),
          },
        },
      },
      layout: this.props.layout || {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: this.props.paint || {
        "line-color": "#888",
        "line-width": 3,
      },
    });
  }

  public remove() {
    if (!this.map) {
      return;
    }
    this.map.removeLayer(this.props.id);
    this.map.removeSource(this.props.id);
    this.map = undefined;
  }
}
