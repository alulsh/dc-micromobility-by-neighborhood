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

async function getVehicles(service) {
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