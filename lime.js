function filterLimeBikes(limeVehicles) {
  const bikesOnly = limeVehicles.filter(
    (vehicle) => vehicle.vehicle_type === "bike"
  );
  return bikesOnly;
}

function convertToGeoJSON(limeBikes) {
  const newLimeBikes = limeBikes.map((bike) => {
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
    features: newLimeBikes,
  };
}

function getLimeBikes() {
  return new Promise((resolve) => {
    fetch("https://vercel-test-alulsh.vercel.app/api/proxy?service=lime")
      .then((response) => response.json())
      .then((jsonData) => {
        let bikesOnly;
        try {
          bikesOnly = filterLimeBikes(jsonData.data.bikes);
          resolve(bikesOnly);
        } catch (error) {
          throw new Error("Cannot filter Lime API vehicle data");
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
}

export { getLimeBikes, filterLimeBikes, convertToGeoJSON };
