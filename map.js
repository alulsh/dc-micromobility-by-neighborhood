/* eslint-disable import/extensions */
import {
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "./cabi.js";
import {
  spin,
  cabiAvailability,
  cabiCapacity,
  limeBikes,
} from "./constants.js";
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

function createPolygonLayer(layer) {
  const polygonLayer = {
    id: layer.layerId,
    type: "fill",
    source: "dc-neighborhoods-source",
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": layer.fillColor,
      "fill-opacity": 0.6,
      "fill-outline-color": layer.fillOutlineColor,
    },
  };

  if (layer.layerId === "cabi-bikes-availability") {
    polygonLayer.layout.visibility = "visible";
  }

  map.addLayer(polygonLayer);
}

function addLimeBikeLayer(limeBikeGeojson) {
  return new Promise((resolve) => {
    map.addSource("lime-bikes-source", {
      type: "geojson",
      data: limeBikeGeojson,
    });
    createPointLayer("lime-bikes", "#50C878");
    createPolygonLayer(limeBikes);

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
    createPolygonLayer(spin);
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
    createPolygonLayer(cabiAvailability);
    createPolygonLayer(cabiCapacity);
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

function getNeighborhoodPolygons() {
  return map.queryRenderedFeatures({
    layers: ["dc-neighborhoods-polygons"],
  });
}

function calculateVehiclesPerNeighborhood(vehicleGeoJSON) {
  return new Promise((resolve) => {
    const neighborhoods = getNeighborhoodPolygons();
    neighborhoods.forEach((neighborhood) => {
      const neighborhoodPolygon = turf.polygon(
        neighborhood.geometry.coordinates
      );
      const vehiclesPerNeighborhood = turf.pointsWithinPolygon(
        vehicleGeoJSON,
        neighborhoodPolygon
      );

      if (vehicleGeoJSON.service === "Capital Bikeshare") {
        let totalBikeCapacity = 0;
        let totalBikesAvailable = 0;
        vehiclesPerNeighborhood.features.forEach((station) => {
          totalBikeCapacity += station.properties.capacity;
          totalBikesAvailable += station.properties.bikesAvailable;
        });
        map.setFeatureState(
          {
            source: "dc-neighborhoods-source",
            id: neighborhood.id,
          },
          {
            totalBikeCapacity,
            totalBikesAvailable,
          }
        );
      } else {
        const totalVehicles = vehiclesPerNeighborhood.features.length;
        const { featureStateName } = vehicleGeoJSON;
        map.setFeatureState(
          {
            source: "dc-neighborhoods-source",
            id: neighborhood.id,
          },
          {
            [featureStateName]: totalVehicles,
          }
        );
      }
    });
    resolve(neighborhoods);
  });
}

function fetchBikeData() {
  const cabiStationInformation = getCabiStationInformation();
  const cabiStationStatus = getCabiStationStatus();
  getLimeBikes().then(addLimeBikeLayer).then(calculateVehiclesPerNeighborhood);
  getSpinScooters()
    .then(addSpinScootersLayer)
    .then(calculateVehiclesPerNeighborhood);

  Promise.all([cabiStationInformation, cabiStationStatus]).then((promises) => {
    const mergedData = mergeCabiStationJSON(promises[0], promises[1]);
    addCabiSource(mergedData)
      .then(addCabiLayers)
      .then(calculateVehiclesPerNeighborhood);
  });
}

map.on("load", () => {
  addNeighborhoodPolygons();
  fetchBikeData();
});

export { addCabiSource, fetchBikeData };
