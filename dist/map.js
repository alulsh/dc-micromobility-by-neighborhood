var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { spin, helbiz } from "./constants.js";
import { getCabiStationInformation, getCabiStationStatus, mergeCabiStationJSON, } from "./cabi.js";
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
    if (geoJSON.properties) {
        map.addSource(geoJSON.properties.sourceId, {
            type: "geojson",
            data: geoJSON,
        });
    }
}
function createPointLayer(service) {
    const layer = {
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
function createPolygonLayer(service) {
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
    map.addLayer(layer);
}
function addLayers(geoJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = geoJSON.properties;
        addSource(geoJSON);
        if ((service === null || service === void 0 ? void 0 : service.name) === "Capital Bikeshare") {
            createPolygonLayer(service.availability);
            createPolygonLayer(service.percentAvailable);
            createPolygonLayer(service.capacity);
        }
        else {
            createPolygonLayer(service);
        }
        createPointLayer(service);
        return geoJSON;
    });
}
function getNeighborhoodPolygons() {
    // undefined is needed for TypeScript bug when omitting the viewport bbox
    return map.queryRenderedFeatures(undefined, {
        layers: ["dc-neighborhoods-polygons"],
    });
}
function setMapFeatureState(id, vehiclesPerNeighborhood, disabledVehiclesPerNeighborhood, geoJSON) {
    if (geoJSON.properties.name === "Capital Bikeshare") {
        let totalBikeCapacity = 0;
        let totalBikesAvailable = 0;
        vehiclesPerNeighborhood.features.forEach((station) => {
            if (station.properties) {
                totalBikeCapacity += station.properties.capacity;
                totalBikesAvailable += station.properties.bikesAvailable;
            }
        });
        const percentAvailable = calculatePercentageAvailable(totalBikesAvailable, totalBikeCapacity);
        map.setFeatureState({
            source: "dc-neighborhoods-source",
            id,
        }, {
            totalBikeCapacity,
            totalBikesAvailable,
            percentAvailable: percentAvailable.number,
        });
    }
    else {
        const totalVehicles = vehiclesPerNeighborhood.features.length;
        const totalDisabledVehicles = disabledVehiclesPerNeighborhood.features.length;
        const { featureStateName } = geoJSON.properties;
        const { featureStateDisabledName } = geoJSON.properties;
        map.setFeatureState({
            source: "dc-neighborhoods-source",
            id,
        }, {
            [featureStateName]: totalVehicles,
            [featureStateDisabledName]: totalDisabledVehicles,
        });
    }
}
function filterDisabledVehicles(vehicles) {
    return vehicles.filter((vehicle) => { var _a; return ((_a = vehicle === null || vehicle === void 0 ? void 0 : vehicle.properties) === null || _a === void 0 ? void 0 : _a.isDisabled) === 1; });
}
function calculateVehiclesPerNeighborhood(vehicleGeoJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        const neighborhoods = getNeighborhoodPolygons();
        neighborhoods.forEach((neighborhood) => {
            if (neighborhood.geometry.type === "Polygon") {
                const neighborhoodPolygon = turf.polygon(neighborhood.geometry.coordinates);
                const vehiclesPerNeighborhood = turf.pointsWithinPolygon(vehicleGeoJSON, neighborhoodPolygon);
                const disabledVehicles = filterDisabledVehicles(vehicleGeoJSON.features);
                const disabledVehiclesPerNeighborhood = turf.pointsWithinPolygon({ type: "FeatureCollection", features: disabledVehicles }, neighborhoodPolygon);
                setMapFeatureState(neighborhood.id, vehiclesPerNeighborhood, disabledVehiclesPerNeighborhood, vehicleGeoJSON);
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
    getVehicles(spin)
        .then(addLayers)
        .then(calculateVehiclesPerNeighborhood);
    getVehicles(helbiz)
        .then(addLayers)
        .then(calculateVehiclesPerNeighborhood);
    getCapitalBikeshareBikes()
        .then(addLayers)
        .then(calculateVehiclesPerNeighborhood);
}
map.on("load", () => {
    addNeighborhoodPolygons().then(fetchVehicleData);
});
