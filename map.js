/* eslint-disable import/extensions */
import {
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "./cabi.js";
import { getLimeBikes } from "./lime.js";
import { getSpinScooters } from "./spin.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";

export const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-77.04, 38.89],
  zoom: 10.6,
});

function addCabiSource(stationGeoJSON) {
  return new Promise((resolve) => {
    map.addSource("cabi-stations-source", {
      type: "geojson",
      data: stationGeoJSON,
    });
    resolve(stationGeoJSON);
  });
}

function addNeighborhoodPolygons() {
  map.addSource("dc-neighborhoods-source", {
    type: "geojson",
    data: "https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson",
    generateId: true,
  });
  map.addLayer({
    id: "dc-neighborhoods-polygons",
    type: "fill",
    source: "dc-neighborhoods-source",
    layout: {
      visibility: "visible",
    },
    paint: {
      "fill-opacity": 0,
    },
  });
}

function createPointLayer(service, color) {
  const layer = {
    id: `${service}-points`,
    type: "circle",
    source: `${service}-source`,
    layout: {
      visibility: "none",
    },
    minzoom: 12,
    paint: {
      "circle-color": color,
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  };

  if (service === "cabi-stations") {
    // regionId 42 is for Washington, D.C.
    layer.filter = ["==", "regionId", "42"];
    layer.layout.visibility = "visible";
  }

  map.addLayer(layer);
}

function addLimeBikeLayer(limeBikeGeojson) {
  return new Promise((resolve) => {
    map.addSource("lime-bikes-source", {
      type: "geojson",
      data: limeBikeGeojson,
    });
    createPointLayer("lime-bikes", "#50C878");
    map.addLayer({
      id: "total-lime-bikes",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalLimeBikes"],
          0,
          ["to-color", "rgb(255, 255, 255)"],
          5,
          ["to-color", "rgb(244, 255, 212)"],
          10,
          ["to-color", "rgb(233, 255, 170)"],
          15,
          ["to-color", "rgb(223, 255, 127)"],
          20,
          ["to-color", "rgb(212, 255, 85)"],
          25,
          ["to-color", "rgb(201, 255, 42)"],
          30,
          ["to-color", "rgb(191, 255, 0)"],
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "#DCDCDC",
      },
    });
    map.on("sourcedata", function sourceLoaded(e) {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve(limeBikeGeojson);
      }
    });
  });
}

function addSpinScootersLayer(spinScootersGeoJSON) {
  return new Promise((resolve) => {
    map.addSource("spin-scooters-source", {
      type: "geojson",
      data: spinScootersGeoJSON,
    });
    createPointLayer("spin-scooters", "#EE4B2B");
    map.addLayer({
      id: "total-spin-scooters",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalSpinScooters"],
          0,
          ["to-color", "rgb(255, 255, 255)"],
          25,
          ["to-color", "#ffa600"],
          50,
          ["to-color", "#ff970c"],
          75,
          ["to-color", "#ff8718"],
          100,
          ["to-color", "#ff7723"],
          125,
          ["to-color", "#ff662c"],
          150,
          ["to-color", "#ff5435"],
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "#DCDCDC",
      },
    });
    map.on("sourcedata", function sourceLoaded(e) {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve(spinScootersGeoJSON);
      }
    });
  });
}

function addCabiLayers(stationGeoJSON) {
  return new Promise((resolve) => {
    map.addLayer({
      id: "cabi-bikes-availability",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalBikesAvailable"],
          0,
          ["to-color", "#F2F12D"],
          10,
          ["to-color", "#EED322"],
          20,
          ["to-color", "#E6B71E"],
          50,
          ["to-color", "#DA9C20"],
          100,
          ["to-color", "#CA8323"],
          200,
          ["to-color", "#B86B25"],
          300,
          ["to-color", "#A25626"],
          400,
          ["to-color", "#8B4225"],
          500,
          ["to-color", "#723122"],
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "#FFF",
      },
    });

    map.addLayer({
      id: "cabi-bikes-capacity",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalBikeCapacity"],
          0,
          ["to-color", "#F2F12D"],
          10,
          ["to-color", "#EED322"],
          20,
          ["to-color", "#E6B71E"],
          50,
          ["to-color", "#DA9C20"],
          100,
          ["to-color", "#CA8323"],
          200,
          ["to-color", "#B86B25"],
          300,
          ["to-color", "#A25626"],
          400,
          ["to-color", "#8B4225"],
          500,
          ["to-color", "#723122"],
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "#FFF",
      },
    });

    createPointLayer("cabi-stations", "#363636");

    map.on("sourcedata", function sourceLoaded(e) {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve(stationGeoJSON);
      }
    });
  });
}

function calculateCabiBikesPerPolygon(stationGeoJSON) {
  return new Promise((resolve) => {
    const dcPolygons = map.queryRenderedFeatures({
      layers: ["dc-neighborhoods-polygons"],
    });
    dcPolygons.forEach((feature) => {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const cabiWithin = turf.pointsWithinPolygon(stationGeoJSON, polygon);

      let totalBikeCapacity = 0;
      let totalBikesAvailable = 0;
      cabiWithin.features.forEach((station) => {
        totalBikeCapacity += station.properties.capacity;
        totalBikesAvailable += station.properties.bikesAvailable;
      });

      map.setFeatureState(
        {
          source: "dc-neighborhoods-source",
          id: feature.id,
        },
        {
          totalBikeCapacity,
          totalBikesAvailable,
        }
      );
    });
    resolve(dcPolygons);
  });
}

function calculateLimeBikesPerPolygon(limeBikeGeojson) {
  return new Promise((resolve) => {
    const dcPolygons = map.queryRenderedFeatures({
      layers: ["dc-neighborhoods-polygons"],
    });
    dcPolygons.forEach((feature) => {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const limeBikesWithin = turf.pointsWithinPolygon(
        limeBikeGeojson,
        polygon
      );

      const totalLimeBikes = limeBikesWithin.features.length;

      map.setFeatureState(
        {
          source: "dc-neighborhoods-source",
          id: feature.id,
        },
        {
          totalLimeBikes,
        }
      );
    });
    resolve(dcPolygons);
  });
}

function calculateSpinScootersPerPolygon(spinScootersGeoJSON) {
  return new Promise((resolve) => {
    const dcPolygons = map.queryRenderedFeatures({
      layers: ["dc-neighborhoods-polygons"],
    });
    dcPolygons.forEach((feature) => {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const spinScootersWithin = turf.pointsWithinPolygon(
        spinScootersGeoJSON,
        polygon
      );

      const totalSpinScooters = spinScootersWithin.features.length;

      map.setFeatureState(
        {
          source: "dc-neighborhoods-source",
          id: feature.id,
        },
        {
          totalSpinScooters,
        }
      );
    });
    resolve(dcPolygons);
  });
}

function fetchBikeData() {
  const cabiStationInformation = getCabiStationInformation();
  const cabiStationStatus = getCabiStationStatus();
  getLimeBikes().then(addLimeBikeLayer).then(calculateLimeBikesPerPolygon);
  getSpinScooters()
    .then(addSpinScootersLayer)
    .then(calculateSpinScootersPerPolygon);

  Promise.all([cabiStationInformation, cabiStationStatus]).then((promises) => {
    const mergedData = mergeCabiStationJSON(promises[0], promises[1]);
    addCabiSource(mergedData)
      .then(addCabiLayers)
      .then(calculateCabiBikesPerPolygon);
  });
}

map.on("load", () => {
  addNeighborhoodPolygons();
  fetchBikeData();
});

export { addCabiSource, fetchBikeData };
