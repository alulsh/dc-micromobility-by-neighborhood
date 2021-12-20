/* eslint-disable import/no-named-as-default-member */
import type { CabiSubService, Service, CabiService } from "services";
import type { FeatureCollection } from "geojson";
import type { AnyLayer } from "mapbox-gl";
import { spin, helbiz } from "./constants.js";
import {
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "./cabi.js";
import { getVehicles } from "./vehicles.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";

// eslint-disable-next-line import/prefer-default-export
export const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-77.04, 38.89],
  zoom: 10.6,
});

function checkSourceLoaded() {
  return new Promise((resolve) => {
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

async function addNeighborhoodPolygons() {
  map.addSource("dc-neighborhoods-source", {
    type: "geojson",
    data: "dc-neighborhoods.geojson",
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

  await checkSourceLoaded();
}

export type FeatureCollectionWithProperties = FeatureCollection & {
  properties: Service | CabiService;
};

function addSource(geoJSON: FeatureCollectionWithProperties) {
  if (geoJSON.properties) {
    map.addSource(geoJSON.properties.sourceId, {
      type: "geojson",
      data: geoJSON,
    });
  }
}

function createPointLayer(properties: Service) {
  const layer: mapboxgl.AnyLayer = {
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

  if (properties.pointLayerId === "spin-scooters-points") {
    if (layer.layout) {
      layer.layout.visibility = "visible";
    }
  }

  map.addLayer(layer);
}

function createPolygonLayer(properties: Service | CabiSubService) {
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

  if (properties.polygonLayerId === "total-spin-scooters") {
    polygonLayer.layout.visibility = "visible";
  }

  map.addLayer(<AnyLayer>polygonLayer);
}

async function addLayers(geoJSON: any) {
  const { properties } = geoJSON;
  addSource(geoJSON);

  if (properties?.service === "Capital Bikeshare") {
    createPolygonLayer(properties.availability);
    createPolygonLayer(properties.capacity);
  } else {
    createPolygonLayer(properties);
  }

  createPointLayer(properties);

  return geoJSON;
}

function getNeighborhoodPolygons() {
  // undefined is needed for TypeScript bug when omitting the viewport bbox
  return map.queryRenderedFeatures(undefined, {
    layers: ["dc-neighborhoods-polygons"],
  });
}

function setMapFeatureState(
  id: number,
  vehiclesPerNeighborhood: FeatureCollectionWithProperties,
  geoJSON: FeatureCollectionWithProperties
) {
  if (geoJSON.properties.service === "Capital Bikeshare") {
    let totalBikeCapacity = 0;
    let totalBikesAvailable = 0;
    vehiclesPerNeighborhood.features.forEach((station) => {
      if (station.properties) {
        totalBikeCapacity += station.properties.capacity;
        totalBikesAvailable += station.properties.bikesAvailable;
      }
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
    const { featureStateName } = <Service>geoJSON.properties;
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

async function calculateVehiclesPerNeighborhood(
  vehicleGeoJSON: FeatureCollectionWithProperties
) {
  const neighborhoods = getNeighborhoodPolygons();
  neighborhoods.forEach((neighborhood) => {
    if (neighborhood.geometry.type === "Polygon") {
      const neighborhoodPolygon = turf.polygon(
        neighborhood.geometry.coordinates
      );

      const vehiclesPerNeighborhood = turf.pointsWithinPolygon(
        vehicleGeoJSON,
        neighborhoodPolygon
      );

      setMapFeatureState(
        <number>neighborhood.id,
        <FeatureCollectionWithProperties>vehiclesPerNeighborhood,
        vehicleGeoJSON
      );
    }
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

function fetchVehicleData() {
  getVehicles(<Service>spin)
    .then(addLayers)
    .then(calculateVehiclesPerNeighborhood);
  getVehicles(<Service>helbiz)
    .then(addLayers)
    .then(calculateVehiclesPerNeighborhood);

  getCapitalBikeshareBikes()
    .then(addLayers)
    .then(calculateVehiclesPerNeighborhood);
}

map.on("load", () => {
  addNeighborhoodPolygons().then(fetchVehicleData);
});
