'use strict';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-77.04, 38.89],
  zoom: 10.60
});

function BikeShareStation(lon, lat, capacity) {
  this.type = 'Feature',
  this.geometry = {},
  this.properties = {},
  this.geometry.type = 'Point',
  this.geometry.coordinates = [lon, lat],
  this.properties.capacity = capacity;
}

function FeatureCollection(features) {
  this.type = 'FeatureCollection',
  this.features = features;
}

function cabiData() {
  let stationArray = [];

  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.open('GET', 'https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json');
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      const stations = request.response.data.stations;
      stations.forEach(station => {
        let newStation = new BikeShareStation(station.lon, station.lat, station.capacity);
        stationArray.push(newStation);
      });
      resolve(stationArray);
    };
  });
}

function loadDcNeighborhoods(bikeshareData) {

  let request = new XMLHttpRequest();
  request.open('GET', 'https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson');
  request.responseType = 'json';
  request.send();
  request.onload = () => {
    const cabiStations = new FeatureCollection(bikeshareData);
    const neighborhoods = request.response.features;

    neighborhoods.forEach(neighborhood => {
      const polygon = turf.polygon(neighborhood.geometry.coordinates);
      const cabiWithin = turf.pointsWithinPolygon(cabiStations, polygon);

      let totalBikes = 0;
      cabiWithin.features.forEach(station =>{
        totalBikes += station.properties.capacity;
      });

      neighborhood.properties.cabiBikes = totalBikes;

      map.addLayer({
        id: `cabibikes-${neighborhood.properties.OBJECTID}`,
        type: 'fill',
        source: {
          type: 'geojson',
          data: neighborhood
        },
        layout: {
          visibility: 'visible'
        },
        paint: {
          'fill-color': {
            property: 'cabiBikes',
            stops: [
              [0, '#F2F12D'],
              [10, '#EED322'],
              [20, '#E6B71E'],
              [50, '#DA9C20'],
              [100, '#CA8323'],
              [200, '#B86B25'],
              [300, '#A25626'],
              [400, '#8B4225'],
              [500, '#723122']
            ]
          },
          'fill-opacity': 0.6,
          'fill-outline-color': '#FFF'
        }
      });

      let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mouseenter', `cabibikes-${neighborhood.properties.OBJECTID}`, e => {
        popup.setLngLat(e.lngLat)
          .setHTML(`<h4>${e.features[0].properties.NBH_NAMES}</h4><p>${e.features[0].properties.cabiBikes} Capital Bikeshare bikes</p>`)
          .addTo(map);
      });

      map.on('mouseleave', `cabibikes-${neighborhood.properties.OBJECTID}`, () => {
        popup.remove();
      });

    });
  };
}

map.on('load', () => {

  let bikeshare = cabiData()
    .then(res => res)
    .catch(err => console.error(err));

  Promise.all([bikeshare]).then(res => {
    loadDcNeighborhoods(res[0]);
  });

});
