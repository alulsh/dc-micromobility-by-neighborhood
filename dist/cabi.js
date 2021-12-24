var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { capitalBikeshare } from "./constants.js";
function convertToGeoJSON(bikeshareJSON) {
    const stations = [];
    bikeshareJSON.forEach((station) => {
        const feature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [station.lon, station.lat],
            },
            properties: {
                name: station.name,
                regionId: station.region_id,
                capacity: station.capacity,
                stationId: station.station_id,
            },
        };
        stations.push(feature);
    });
    return {
        type: "FeatureCollection",
        properties: capitalBikeshare,
        features: stations,
    };
}
function getCabiStationInformation() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json");
        const json = yield response.json();
        const stationGeoJSON = convertToGeoJSON(json.data.stations);
        return stationGeoJSON;
    });
}
function getCabiStationStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json");
        const json = yield response.json();
        return json.data.stations;
    });
}
function mergeCabiStationJSON(stationGeoJSON, stationStatus) {
    const mergedFeatures = stationGeoJSON.features.map((feature) => (Object.assign(Object.assign({}, feature), stationStatus.find((station) => { var _a; return ((_a = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _a === void 0 ? void 0 : _a.stationId) === station.station_id; }))));
    const cleanFeatures = mergedFeatures.map((feature) => {
        const cleanFeature = feature;
        delete cleanFeature.eightd_has_available_keys;
        delete cleanFeature.legacy_id;
        delete cleanFeature.station_status;
        delete cleanFeature.is_returning;
        delete cleanFeature.is_installed;
        delete cleanFeature.last_reported;
        delete cleanFeature.station_id;
        cleanFeature.properties.isRenting = feature.is_renting;
        delete cleanFeature.is_renting;
        cleanFeature.properties.ebikesAvailable = feature.num_ebikes_available;
        delete cleanFeature.num_ebikes_available;
        cleanFeature.properties.docksAvailable = feature.num_docks_available;
        delete cleanFeature.num_docks_available;
        cleanFeature.properties.bikesAvailable = feature.num_bikes_available;
        delete cleanFeature.num_bikes_available;
        cleanFeature.properties.bikesDisabled = feature.num_bikes_disabled;
        delete cleanFeature.num_bikes_disabled;
        cleanFeature.properties.docksDisabled = feature.num_docks_disabled;
        delete cleanFeature.num_docks_disabled;
        return cleanFeature;
    });
    return {
        type: "FeatureCollection",
        properties: capitalBikeshare,
        features: cleanFeatures,
    };
}
export { convertToGeoJSON, getCabiStationInformation, getCabiStationStatus, mergeCabiStationJSON, };
