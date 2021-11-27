/* eslint-disable import/extensions */
import {
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "./cabi.js";
import { getLimeBikes } from "./lime.js";
import { getSpinScooters } from "./spin.js";
import { getBirdScooters } from "./bird.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";

export const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-77.04, 38.89],
  zoom: 10.6,
});

function addNeighborhoodPolygons() {
  return new Promise((resolve) => {
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

    map.on("sourcedata", (e) => {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve("Neighborhood polygon source loaded");
      }
    });
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
  }

  if (properties.pointLayerId === "lime-bikes-points") {
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

  if (properties.polygonLayerId === "total-lime-bikes") {
    polygonLayer.layout.visibility = "visible";
  }

  map.addLayer(polygonLayer);
}

async function addLayers(geoJSON) {
  const { properties } = geoJSON;
  addSource(geoJSON);

  if (properties.service === "Capital Bikeshare") {
    createPolygonLayer(properties.availability);
    createPolygonLayer(properties.capacity);
  } else {
    createPolygonLayer(properties);
  }

  createPointLayer(properties);

  return geoJSON;
}

function getNeighborhoodPolygons() {
  return map.queryRenderedFeatures({
    layers: ["dc-neighborhoods-polygons"],
  });
}

function setMapFeatureState(id, vehiclesPerNeighborhood, geoJSON) {
  if (geoJSON.properties.service === "Capital Bikeshare") {
    let totalBikeCapacity = 0;
    let totalBikesAvailable = 0;
    vehiclesPerNeighborhood.features.forEach((station) => {
      totalBikeCapacity += station.properties.capacity;
      totalBikesAvailable += station.properties.bikesAvailable;
    });
    map.setFeatureState(
      {
        source: "dc-neighborhoods-source",
        id,
      },
      {
        totalBikeCapacity,
        totalBikesAvailable,
      }
    );
  } else {
    const totalVehicles = vehiclesPerNeighborhood.features.length;
    const { featureStateName } = geoJSON.properties;
    map.setFeatureState(
      {
        source: "dc-neighborhoods-source",
        id,
      },
      {
        [featureStateName]: totalVehicles,
      }
    );
  }
}

async function calculateVehiclesPerNeighborhood(vehicleGeoJSON) {
  const neighborhoods = await getNeighborhoodPolygons();
  neighborhoods.forEach((neighborhood) => {
    const neighborhoodPolygon = turf.polygon(neighborhood.geometry.coordinates);
    const vehiclesPerNeighborhood = turf.pointsWithinPolygon(
      vehicleGeoJSON,
      neighborhoodPolygon
    );

    setMapFeatureState(
      neighborhood.id,
      vehiclesPerNeighborhood,
      vehicleGeoJSON
    );
  });
}

async function getCapitalBikeshareBikes() {
  const cabiStationInformation = await getCabiStationInformation();
  const cabiStationStatus = await getCabiStationStatus();

  const mergedData = mergeCabiStationJSON(
    cabiStationInformation,
    cabiStationStatus
  );

  return mergedData;
}

function fetchBikeData() {
  getLimeBikes().then(addLayers).then(calculateVehiclesPerNeighborhood);
  getSpinScooters().then(addLayers).then(calculateVehiclesPerNeighborhood);
  getBirdScooters().then(addLayers).then(calculateVehiclesPerNeighborhood);

  getCapitalBikeshareBikes()
    .then(addLayers)
    .then(calculateVehiclesPerNeighborhood);
}

map.on("load", () => {
  addNeighborhoodPolygons().then(fetchBikeData);
});

export { fetchBikeData };
