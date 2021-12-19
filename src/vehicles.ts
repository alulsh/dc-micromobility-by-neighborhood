import { Feature, FeatureCollection } from "geojson";
import type { Service } from "services";

function filterVehicles(
  vehicles: Record<string, string | number>[],
  type: string
) {
  return vehicles.filter((vehicle) => vehicle.vehicle_type === type);
}

function convertToGeoJSON(service: Service, vehicles: any[]) {
  const vehicleFeatures = vehicles.map((vehicle) => {
    const vehicleFeature: Feature = {
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
  } as FeatureCollection;
}

async function getVehicles(service: Service) {
  let vehicleJSON;
  const response = await fetch(service.url);
  const jsonData = await response.json();

  if (service.service === "Helbiz") {
    vehicleJSON = filterVehicles(jsonData.data.bikes, "scooter");
  } else {
    vehicleJSON = jsonData.data.bikes;
  }

  const vehiclesGeoJSON = convertToGeoJSON(service, vehicleJSON);

  return vehiclesGeoJSON;
}

export { getVehicles, convertToGeoJSON, filterVehicles };
