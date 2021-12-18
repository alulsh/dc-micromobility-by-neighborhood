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
    const vehicleFeatures = vehicles.map((vehicle) => {
        const vehicleFeature = {
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
        return vehicleFeature;
    });
    return {
        type: "FeatureCollection",
        properties: service,
        features: vehicleFeatures,
    };
}
function getVehicles(service) {
    return __awaiter(this, void 0, void 0, function* () {
        let vehicleJSON;
        const response = yield fetch(service.url);
        const jsonData = yield response.json();
        if (service.service === "Helbiz") {
            vehicleJSON = filterVehicles(jsonData.data.bikes, "scooter");
        }
        else {
            vehicleJSON = jsonData.data.bikes;
        }
        const vehiclesGeoJSON = convertToGeoJSON(service, vehicleJSON);
        return vehiclesGeoJSON;
    });
}
export { getVehicles, convertToGeoJSON, filterVehicles };
