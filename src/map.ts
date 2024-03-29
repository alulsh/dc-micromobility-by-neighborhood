import type { CabiSubService, Service, CabiService } from "services";
import type { FeatureCollection, Feature } from "geojson";
import type { AnyLayer } from "mapbox-gl";
import { spin, helbiz } from "./constants.js";
import {
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "./cabi.js";
import { getVehicles } from "./vehicles.js";
import calculatePercentageAvailable from "./utilities.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";

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

function createPointLayer(service: Service) {
  const layer: mapboxgl.AnyLayer = {
    id: service.pointLayerId,
    type: "circle",
    source: service.sourceId,
    layout: {
      visibility: "none",
    },
    minzoom: 12,
    paint: {
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
      "circle-color": [
        "match",
        ["get", "isDisabled"],
        0,
        service.pointCircleColor,
        1,
        "#ccc",
        service.pointCircleColor,
      ],
    },
  };

  if (service.name === "Capital Bikeshare") {
    // regionId 42 is for Washington, D.C.
    layer.filter = ["==", "regionId", "42"];
  }

  if (service.default) {
    if (layer.layout) {
      layer.layout.visibility = "visible";
    }
  }

  map.addLayer(layer);
}

function createPolygonLayer(service: Service | CabiSubService) {
  const layer = {
    id: service.polygonLayerId,
    type: "fill",
    source: "dc-neighborhoods-source",
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": service.polygonFillColor,
      "fill-opacity": 0.6,
      "fill-outline-color": service.polygonFillOutlineColor,
    },
  };

  if (service.default) {
    layer.layout.visibility = "visible";
  }

  map.addLayer(<AnyLayer>layer);
}

async function addLayers(geoJSON: any) {
  const service = geoJSON.properties;
  addSource(geoJSON);

  if (service?.name === "Capital Bikeshare") {
    createPolygonLayer(service.availability);
    createPolygonLayer(service.percentAvailable);
    createPolygonLayer(service.capacity);
  } else {
    createPolygonLayer(service);
  }

  createPointLayer(service);

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
  disabledVehiclesPerNeighborhood: FeatureCollection,
  geoJSON: FeatureCollectionWithProperties
) {
  if (geoJSON.properties.name === "Capital Bikeshare") {
    let totalBikeCapacity = 0;
    let totalBikesAvailable = 0;
    vehiclesPerNeighborhood.features.forEach((station) => {
      if (station.properties) {
        totalBikeCapacity += station.properties.capacity;
        totalBikesAvailable += station.properties.bikesAvailable;
      }
    });

    const percentAvailable = calculatePercentageAvailable(
      totalBikesAvailable,
      totalBikeCapacity
    );

    map.setFeatureState(
      {
        source: "dc-neighborhoods-source",
        id,
      },
      {
        totalBikeCapacity,
        totalBikesAvailable,
        percentAvailable: percentAvailable.number,
      }
    );
  } else {
    const totalVehicles = vehiclesPerNeighborhood.features.length;
    const totalDisabledVehicles =
      disabledVehiclesPerNeighborhood.features.length;
    const { featureStateName } = <Service>geoJSON.properties;
    const { featureStateDisabledName } = <Service>geoJSON.properties;
    map.setFeatureState(
      {
        source: "dc-neighborhoods-source",
        id,
      },
      {
        [featureStateName]: totalVehicles,
        [featureStateDisabledName]: totalDisabledVehicles,
      }
    );
  }
}

function filterDisabledVehicles(vehicles: any) {
  return vehicles.filter(
    (vehicle: Feature) => vehicle?.properties?.isDisabled === 1
  );
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
      const disabledVehicles = filterDisabledVehicles(vehicleGeoJSON.features);
      const disabledVehiclesPerNeighborhood = turf.pointsWithinPolygon(
        { type: "FeatureCollection", features: disabledVehicles },
        neighborhoodPolygon
      );

      setMapFeatureState(
        <number>neighborhood.id,
        <FeatureCollectionWithProperties>vehiclesPerNeighborhood,
        <FeatureCollection>disabledVehiclesPerNeighborhood,
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
