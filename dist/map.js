/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/extensions */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCabiStationInformation, getCabiStationStatus, mergeCabiStationJSON, } from "../dist/cabi.js";
import { spin, helbiz } from "../dist/constants.js";
import { getVehicles } from "../dist/vehicles.js";
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
            if (e.sourceId === "dc-neighborhoods-source" &&
                e.isSourceLoaded &&
                e.coord) {
                resolve("Neighborhood polygon source loaded");
            }
        });
    });
}
function addNeighborhoodPolygons() {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield checkSourceLoaded();
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
    if (properties.pointLayerId === "spin-scooters-points") {
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
    if (properties.polygonLayerId === "total-spin-scooters") {
        polygonLayer.layout.visibility = "visible";
    }
    map.addLayer(polygonLayer);
}
function addLayers(geoJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        const { properties } = geoJSON;
        addSource(geoJSON);
        if (properties.service === "Capital Bikeshare") {
            createPolygonLayer(properties.availability);
            createPolygonLayer(properties.capacity);
        }
        else {
            createPolygonLayer(properties);
        }
        createPointLayer(properties);
        return geoJSON;
    });
}
function getNeighborhoodPolygons() {
    // needed for TypeScript bug when omitting the viewport bbox
    let viewport;
    return map.queryRenderedFeatures(viewport, {
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
        map.setFeatureState({
            source: "dc-neighborhoods-source",
            id,
        }, {
            totalBikeCapacity,
            totalBikesAvailable,
        });
    }
    else {
        const totalVehicles = vehiclesPerNeighborhood.features.length;
        const { featureStateName } = geoJSON.properties;
        map.setFeatureState({
            source: "dc-neighborhoods-source",
            id,
        }, {
            [featureStateName]: totalVehicles,
        });
    }
}
function calculateVehiclesPerNeighborhood(vehicleGeoJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        const neighborhoods = getNeighborhoodPolygons();
        neighborhoods.forEach((neighborhood) => {
            if (neighborhood.geometry.type === "Polygon") {
                const neighborhoodPolygon = turf.polygon(neighborhood.geometry.coordinates);
                const vehiclesPerNeighborhood = turf.pointsWithinPolygon(vehicleGeoJSON, neighborhoodPolygon);
                setMapFeatureState(neighborhood.id, vehiclesPerNeighborhood, vehicleGeoJSON);
            }
        });
    });
}
function getCapitalBikeshareBikes() {
    return __awaiter(this, void 0, void 0, function* () {
        const cabiStationInformation = yield getCabiStationInformation();
        const cabiStationStatus = yield getCabiStationStatus();
        const mergedData = mergeCabiStationJSON(cabiStationInformation, cabiStationStatus);
        return mergedData;
    });
}
function fetchVehicleData() {
    getVehicles(spin).then(addLayers).then(calculateVehiclesPerNeighborhood);
    getVehicles(helbiz).then(addLayers).then(calculateVehiclesPerNeighborhood);
    getCapitalBikeshareBikes()
        .then(addLayers)
        .then(calculateVehiclesPerNeighborhood);
}
map.on("load", () => {
    addNeighborhoodPolygons().then(fetchVehicleData);
});
