/* eslint-disable import/extensions */
import { spin } from "./constants.js";

function convertToGeoJSON(spinScooters) {
  const scooterFeatures = spinScooters.map((scooter) => {
    const scooterFeature = {
      type: "Feature",
      geometry: {
        coordinates: [parseFloat(scooter.lon), parseFloat(scooter.lat)],
        type: "Point",
      },
      properties: {
        isReserved: scooter.is_reserved,
        isDisabled: scooter.is_disabled,
        vehicleType: scooter.vehicle_type,
      },
    };
    return scooterFeature;
  });

  return {
    type: "FeatureCollection",
    properties: spin,
    features: scooterFeatures,
  };
}

async function getSpinScooters() {
  const response = await fetch(
    "https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status"
  );

  const jsonData = await response.json();
  const scootersGeoJSON = convertToGeoJSON(jsonData.data.bikes);

  return scootersGeoJSON;
}

export { getSpinScooters, convertToGeoJSON };
