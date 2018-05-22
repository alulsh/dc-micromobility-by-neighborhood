const request = require('request');
const turf = require('@turf/turf');

const dcNeighborhoodData = 'https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson';
const spinData = 'https://web.spin.pm/api/gbfs/v1/free_bike_status';

function spinArray(){
  let bikeArray = [];

  return new Promise((resolve, reject) => {
    request(spinData, (error, response, body) => {
      if (error) reject(error);
      const bikes = JSON.parse(body).data.bikes;
      bikes.forEach(bike => {
        let lonLat = [];

        if (isNumber(bike.lon) && isNumber(bike.lat)) {
          lonLat.push(bike.lon);
          lonLat.push(bike.lat);
          bikeArray.push(lonLat);
        }

      });
      resolve(bikeArray);
    });
  });
}

function isNumber(number) {
  if (typeof number !== 'number') {
    return false;
  } else {
    return true;
  }
}

function loadDcNeighborhoods(spinData) {
  request(dcNeighborhoodData, (error, response, body) => {
    if (error) console.log(error);
    const neighborhoods = JSON.parse(body).features;
    const spinBikes = turf.points(spinData);

    neighborhoods.forEach(neighborhood => {
      const polygon = turf.polygon(neighborhood.geometry.coordinates);
      const ptsWithin = turf.pointsWithinPolygon(spinBikes, polygon);
      console.log(`${ptsWithin.features.length} Spin bikes in ${neighborhood.properties.NBH_NAMES}`);
    });
  });
}

spinArray()
  .then(res => loadDcNeighborhoods(res))
  .catch(err => console.error(err));