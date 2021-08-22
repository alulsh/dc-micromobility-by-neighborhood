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

function addSource(geoJSON) {
  map.addSource(geoJSON.properties.sourceId, {
    type: "geojson",
    data: geoJSON,
  });
}

function createPointLayer(properties) {
  const layer = {
    id: properties.pointLayerId,
    type: "circle",
    source: properties.sourceId,
    layout: {
      visibility: "none",
    },
    minzoom: 12,
    paint: {
      "circle-color": properties.pointCircleColor,
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  };

  if (properties.service === "Capital Bikeshare") {
    // regionId 42 is for Washington, D.C.
    layer.filter = ["==", "regionId", "42"];
    layer.layout.visibility = "visible";
  }

  map.addLayer(layer);
}

function createPolygonLayer(properties) {
  const polygonLayer = {
    id: properties.polygonLayerId,
    type: "fill",
    source: "dc-neighborhoods-source",
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": properties.polygonFillColor,
      "fill-opacity": 0.6,
      "fill-outline-color": properties.polygonFillOutlineColor,
    },
  };

  if (properties.polygonLayerId === "cabi-bikes-availability") {
    polygonLayer.layout.visibility = "visible";
  }

  map.addLayer(polygonLayer);
}

function addLayers(geoJSON) {
  return new Promise((resolve) => {
    const { properties } = geoJSON;
    addSource(geoJSON);
    createPointLayer(properties);

    if (properties.service === "Capital Bikeshare") {
      createPolygonLayer(properties.availability);
      createPolygonLayer(properties.capacity);
    } else {
      createPolygonLayer(properties);
    }

    map.on("sourcedata", function sourceLoaded(e) {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve(geoJSON);
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

      if (vehicleGeoJSON.properties.service === "Capital Bikeshare") {
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
        const { featureStateName } = vehicleGeoJSON.properties;
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

function getCapitalBikeshareBikes() {
  return new Promise((resolve) => {
    const cabiStationInformation = getCabiStationInformation();
    const cabiStationStatus = getCabiStationStatus();

    Promise.all([cabiStationInformation, cabiStationStatus]).then(
      (promises) => {
        const mergedData = mergeCabiStationJSON(promises[0], promises[1]);
        resolve(mergedData);
      }
    );
  });
}

function fetchBikeData() {
  getLimeBikes().then(addLayers).then(calculateVehiclesPerNeighborhood);
  getSpinScooters().then(addLayers).then(calculateVehiclesPerNeighborhood);

  getCapitalBikeshareBikes()
    .then(addLayers)
    .then(calculateVehiclesPerNeighborhood);
}

map.on("load", () => {
  addNeighborhoodPolygons();
  fetchBikeData();
});

export { fetchBikeData };
