/* eslint-disable no-console */

const request = require("request");
const turf = require("@turf/turf");

const dcNeighborhoodData =
  "https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson";
const jumpData = "https://gbfs.uber.com/v1/dcb/free_bike_status.json";

function jumpArray() {
  const bikeArray = [];

  return new Promise((resolve, reject) => {
    request(jumpData, (error, response, body) => {
      if (error) reject(error);
      const { bikes } = JSON.parse(body).data;
      bikes.forEach((bike) => {
        const lonLat = [];
        lonLat.push(bike.lon);
        lonLat.push(bike.lat);
        bikeArray.push(lonLat);
      });
      resolve(bikeArray);
    });
  });
}

function loadDcNeighborhoods(jumpBikeData) {
  request(dcNeighborhoodData, (error, response, body) => {
    if (error) console.log(error);
    const neighborhoods = JSON.parse(body).features;
    const jumpBikes = turf.points(jumpBikeData);

    neighborhoods.forEach((neighborhood) => {
      const polygon = turf.polygon(neighborhood.geometry.coordinates);
      const ptsWithin = turf.pointsWithinPolygon(jumpBikes, polygon);
      console.log(
        `${ptsWithin.features.length} JUMP bikes in ${neighborhood.properties.NBH_NAMES}`
      );
    });
  });
}

jumpArray()
  .then((res) => loadDcNeighborhoods(res))
  .catch((err) => console.error(err));
