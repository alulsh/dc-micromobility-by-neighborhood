function getSpinScooters() {
  return new Promise((resolve) => {
    fetch("https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status")
      .then((response) => response.json())
      .then((jsonData) => {
        resolve(jsonData);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
}

// eslint-disable-next-line import/prefer-default-export
export { getSpinScooters };
