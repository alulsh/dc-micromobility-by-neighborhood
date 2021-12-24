var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function filterVehicles(vehicles, type) {
    return vehicles.filter((vehicle) => vehicle.vehicle_type === type);
}
function convertToGeoJSON(service, vehicles) {
    const features = vehicles.map((vehicle) => {
        const feature = {
            type: "Feature",
            geometry: {
                coordinates: [parseFloat(vehicle.lon), parseFloat(vehicle.lat)],
                type: "Point",
            },
            properties: {
                isReserved: vehicle.is_reserved,
                isDisabled: vehicle.is_disabled,
                vehicleType: vehicle.vehicle_type,
            },
        };
        return feature;
    });
    return {
        type: "FeatureCollection",
        properties: service,
        features,
    };
}
function getVehicles(service) {
    return __awaiter(this, void 0, void 0, function* () {
        let vehicleJSON;
        const response = yield fetch(service.url);
        const json = yield response.json();
        if (service.name === "Helbiz") {
            vehicleJSON = filterVehicles(json.data.bikes, "scooter");
        }
        else {
            vehicleJSON = json.data.bikes;
        }
        const vehiclesGeoJSON = convertToGeoJSON(service, vehicleJSON);
        return vehiclesGeoJSON;
    });
}
export { getVehicles, convertToGeoJSON, filterVehicles };
