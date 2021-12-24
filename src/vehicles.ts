import type { Feature, FeatureCollection } from "geojson";
import type { Service } from "services";
import type { FeatureCollectionWithProperties } from "./map";

function filterVehicles(
  vehicles: Record<string, string | number>[],
  type: string
) {
  return vehicles.filter((vehicle) => vehicle.vehicle_type === type);
}

function convertToGeoJSON(service: Service, vehicles: any[]) {
  const features = vehicles.map((vehicle) => {
    const feature: Feature = {
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
  } as FeatureCollection;
}

async function getVehicles(service: Service) {
  let vehicleJSON;
  const response = await fetch(service.url);
  const json = await response.json();

  if (service.name === "Helbiz") {
    vehicleJSON = filterVehicles(json.data.bikes, "scooter");
  } else {
    vehicleJSON = json.data.bikes;
  }

  const vehiclesGeoJSON = convertToGeoJSON(service, vehicleJSON);

  return <FeatureCollectionWithProperties>vehiclesGeoJSON;
}

export { getVehicles, convertToGeoJSON, filterVehicles };
