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

function getBirdScooters() {
  return new Promise((resolve) => {
    fetch("https://gbfs.bird.co/dc")
      .then((response) => response.json())
      .then((jsonData) => {
        const scootersGeoJSON = convertToGeoJSON(jsonData.data.bikes);
        resolve(scootersGeoJSON);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
}

export { getBirdScooters, convertToGeoJSON };
