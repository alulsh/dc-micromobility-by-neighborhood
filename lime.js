/* eslint-disable import/extensions */
import { limeBikes } from "./constants.js";

function filterLimeBikes(limeVehicles) {
  const bikesOnly = limeVehicles.filter(
    (vehicle) => vehicle.vehicle_type === "bike"
  );
  return bikesOnly;
}

function convertToGeoJSON(limeApi) {
  const newLimeBikes = limeApi.map((bike) => {
    const bikeFeature = {
      type: "Feature",
      geometry: {
        coordinates: [parseFloat(bike.lon), parseFloat(bike.lat)],
        type: "Point",
      },
      properties: {
        isReserved: bike.is_reserved,
        isDisabled: bike.is_disabled,
        vehicleType: bike.vehicle_type,
      },
    };
    return bikeFeature;
  });

  return {
    type: "FeatureCollection",
    properties: limeBikes,
    features: newLimeBikes,
  };
}

function getLimeBikes() {
  return new Promise((resolve) => {
    fetch("https://vercel-cors-proxy.vercel.app/api/proxy?service=lime")
      .then((response) => response.json())
      .then((jsonData) => {
        const bikesOnly = filterLimeBikes(jsonData.data.bikes);
        const bikesGeoJSON = convertToGeoJSON(bikesOnly);
        resolve(bikesGeoJSON);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
}

export { getLimeBikes, filterLimeBikes, convertToGeoJSON };
