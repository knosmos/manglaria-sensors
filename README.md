# ManglarIA Sensor Inventory

<img width="2865" height="1532" alt="image" src="https://github.com/user-attachments/assets/fb54b7df-6e65-4d46-bbb9-f8334e3bee36" />
Deployment: https://manglaria-sensors.vercel.app/

## Run development server

```console
npm run dev
```

## Build for production

```console
npx prettier . --write
npm run build
```

## Editing
* This app reads sensor data from the CSV at `public/sensor_coords.csv`; you can edit this file to add or remove sensors. To add new sensor types, you must add the name to the `src/app/sensor_types.ts` file and upload an icon to the `public/sensor-icons` directory. The icons should be named according to the sensor type, e.g., `current-profiler.png`.
* The sidebar contents can be modified in the `src/app/sidebar.tsx` file.
* The map can be customized by changing the style URL in `src/app/page.tsx`.

## Contact
Jieruei Chang (jieruei@mit.edu)
