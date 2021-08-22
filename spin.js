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
    featureStateName: "totalSpinScooters",
    features: scooterFeatures,
  };
}

function getSpinScooters() {
  return new Promise((resolve) => {
    fetch("https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status")
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

export { getSpinScooters, convertToGeoJSON };
