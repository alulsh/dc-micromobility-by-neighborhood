const request = require('request');
const turf = require('@turf/turf');

const dcNeighborhoodData = 'https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson';
const capitalBikeshareData = 'https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json';

function BikeShareStation (lon, lat, capacity) {
  this.type = 'Feature',
  this.geometry = {},
  this.properties = {},
  this.geometry.type = 'Point',
  this.geometry.coordinates = [lon, lat],
  this.properties.capacity = capacity
}

function FeatureCollection (features) {
  this.type = 'FeatureCollection',
  this.features = features
}

function bikeShareArray(){
  let stationArray = [];

  return new Promise((resolve, reject) => {
    request(capitalBikeshareData, (error, response, body) => {
      if (error) reject(error);
      const stations = JSON.parse(body).data.stations;
      stations.forEach(station => {
        let newStation = new BikeShareStation(station.lon, station.lat, station.capacity);
        stationArray.push(newStation);
      });
      resolve(stationArray);
    });
  });
}

function loadDcNeighborhoods(bikeshareData) {
  request(dcNeighborhoodData, (error, response, body) => {
    if (error) console.log(error);
    const neighborhoods = JSON.parse(body).features;
    const stations = new FeatureCollection(bikeshareData);

    neighborhoods.forEach(neighborhood => {
      const polygon = turf.polygon(neighborhood.geometry.coordinates);
      const ptsWithin = turf.pointsWithinPolygon(stations, polygon);
      const stationsInNeighborhood = ptsWithin.features;

      let totalBikes = 0;
      ptsWithin.features.forEach(station =>{
        totalBikes += station.properties.capacity;
      });
      console.log(`${ptsWithin.features.length} Capital Bikeshare stations with ${totalBikes} bikes in ${neighborhood.properties.NBH_NAMES}`);
    });
  });
}

bikeShareArray()
  .then(res => loadDcNeighborhoods(res))
  .catch(err => console.error(err))