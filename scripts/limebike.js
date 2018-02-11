const request = require('request');
const turf = require('@turf/turf');

const dcNeighborhoodData = 'https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson';

/*
The LimeBike bearer token was tweeted publicly in 
https://twitter.com/DDOTDC/status/960885111066636289
I assume it's ok to have this committed to an open source project
*/

const limeBikeOptions = {
  url: 'https://lime.bike/api/partners/v1/bikes?region=Washington%20DC%20Proper',
  headers: {
    'Authorization': 'Bearer limebike-PMc3qGEtAAXqJa'
  }
};

function limeBikeArray(){
  let limeBikeArray = [];

  return new Promise((resolve, reject) => {
    request(limeBikeOptions, (error, response, body) => {
      if (error) reject(error);
      const bikes = JSON.parse(body).data;
      bikes.forEach(bike => {
        let lonLat = [];
        lonLat.push(bike.attributes.longitude);
        lonLat.push(bike.attributes.latitude);
        limeBikeArray.push(lonLat);
      });
      resolve(limeBikeArray);
    });
  });
}

function loadDcNeighborhoods(limeBikeData) {
  request(dcNeighborhoodData, (error, response, body) => {
    if (error) console.log(error);
    const neighborhoods = JSON.parse(body).features;
    const limeBikes = turf.points(limeBikeData);

    neighborhoods.forEach(neighborhood => {
      const polygon = turf.polygon(neighborhood.geometry.coordinates);
      const ptsWithin = turf.pointsWithinPolygon(limeBikes, polygon);
      console.log(`${ptsWithin.features.length} LimeBikes in ${neighborhood.properties.NBH_NAMES}`);
    });
  });
}

limeBikeArray()
  .then(res => loadDcNeighborhoods(res))
  .catch(err => console.error(err));