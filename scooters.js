function filterVehicles(vehicles, type) {
  return vehicles.filter((vehicle) => vehicle.vehicle_type === type);
}

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
  let vehicleJSON;
  const response = await fetch(service.url);
  const jsonData = await response.json();

  if (service.service === "Lime") {
    vehicleJSON = filterVehicles(jsonData.data.bikes, "bike");
  } else {
    vehicleJSON = jsonData.data.bikes;
  }

  const scootersGeoJSON = convertToGeoJSON(service, vehicleJSON);

  return scootersGeoJSON;
}

export { getScooters, convertToGeoJSON, filterVehicles };
