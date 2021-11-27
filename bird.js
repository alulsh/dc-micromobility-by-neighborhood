/* eslint-disable import/extensions */
import { bird } from "./constants.js";

function convertToGeoJSON(birdScooters) {
  const scooterFeatures = birdScooters.map((scooter) => {
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
    properties: bird,
    features: scooterFeatures,
  };
}

async function getBirdScooters() {
  const response = await fetch("https://gbfs.bird.co/dc");

  const jsonData = await response.json();
  const scootersGeoJSON = convertToGeoJSON(jsonData.data.bikes);

  return scootersGeoJSON;
}

export { getBirdScooters, convertToGeoJSON };
