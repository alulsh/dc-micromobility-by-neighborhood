function convertToGeoJSON(service, scooters) {
  const scooterFeatures = scooters.map((scooter) => {
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
    properties: service,
    features: scooterFeatures,
  };
}

async function getScooters(service) {
  const response = await fetch(service.url);
  const jsonData = await response.json();
  const scootersGeoJSON = convertToGeoJSON(service, jsonData.data.bikes);

  return scootersGeoJSON;
}

export { getScooters, convertToGeoJSON };
