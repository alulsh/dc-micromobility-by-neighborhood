const request = require('request');
const turf = require('@turf/turf');

const dcNeighborhoodData = 'https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson';

/* API endpoint information and token comes from
https://twitter.com/DDOTDC/status/963143987216314368
*/

const ofoOptions = {
  url: 'http://ofo-global.open.ofo.com/api/bike',
  form: {
    token: 'c902b87e3ce8f9f95f73fe7ee14e81fe',
    name: 'Washington',
    lat: 38.894432,
    lng: -77.013655
  }
}

function ofoBikeArray(){
  let ofoBikeArray = [];

  return new Promise((resolve, reject) => {
    request.post(ofoOptions, (error, response, body) => {
      if (error) reject(error);
      const bikes = JSON.parse(body).values.cars;
      bikes.forEach(bike => {
        let lonLat = [];
        lonLat.push(bike.lng);
        lonLat.push(bike.lat);
        ofoBikeArray.push(lonLat);
      });
      resolve(ofoBikeArray);
    });
  });
}

function loadDcNeighborhoods(ofoBikeData) {
  request(dcNeighborhoodData, (error, response, body) => {
    if (error) console.log(error);
    const neighborhoods = JSON.parse(body).features;
    const ofoBikes = turf.points(ofoBikeData);

    neighborhoods.forEach(neighborhood => {
      const polygon = turf.polygon(neighborhood.geometry.coordinates);
      const ptsWithin = turf.pointsWithinPolygon(ofoBikes, polygon);
      console.log(`${ptsWithin.features.length} Ofo bikes in ${neighborhood.properties.NBH_NAMES}`);
    });
  });
}

ofoBikeArray()
  .then(res => loadDcNeighborhoods(res))
  .catch(err => console.error(err));