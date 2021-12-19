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
    const newStationArray = [];
    bikeshareJSON.forEach((station) => {
        const newStation = {
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
        newStationArray.push(newStation);
    });
    return {
        type: "FeatureCollection",
        properties: capitalBikeshare,
        features: newStationArray,
    };
}
function getCabiStationInformation() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json");
        const jsonData = yield response.json();
        const stationGeoJSON = convertToGeoJSON(jsonData.data.stations);
        return stationGeoJSON;
    });
}
function getCabiStationStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json");
        const jsonData = yield response.json();
        return jsonData.data.stations;
    });
}
function mergeCabiStationJSON(stationGeoJSON, stationStatus) {
    const mergedArray = stationGeoJSON.features.map((feature) => (Object.assign(Object.assign({}, feature), stationStatus.find((station) => { var _a; return ((_a = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _a === void 0 ? void 0 : _a.stationId) === station.station_id; }))));
    const cleanedArray = mergedArray.map((item) => {
        const cleanedItem = item;
        delete cleanedItem.eightd_has_available_keys;
        delete cleanedItem.legacy_id;
        delete cleanedItem.station_status;
        delete cleanedItem.is_returning;
        delete cleanedItem.is_installed;
        delete cleanedItem.last_reported;
        delete cleanedItem.station_id;
        cleanedItem.properties.isRenting = item.is_renting;
        delete cleanedItem.is_renting;
        cleanedItem.properties.ebikesAvailable = item.num_ebikes_available;
        delete cleanedItem.num_ebikes_available;
        cleanedItem.properties.docksAvailable = item.num_docks_available;
        delete cleanedItem.num_docks_available;
        cleanedItem.properties.bikesAvailable = item.num_bikes_available;
        delete cleanedItem.num_bikes_available;
        cleanedItem.properties.bikesDisabled = item.num_bikes_disabled;
        delete cleanedItem.num_bikes_disabled;
        cleanedItem.properties.docksDisabled = item.num_docks_disabled;
        delete cleanedItem.num_docks_disabled;
        return cleanedItem;
    });
    return {
        type: "FeatureCollection",
        properties: capitalBikeshare,
        features: cleanedArray,
    };
}
export { convertToGeoJSON, getCabiStationInformation, getCabiStationStatus, mergeCabiStationJSON, };
