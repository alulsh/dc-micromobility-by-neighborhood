/* eslint-disable strict */

"use strict";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-77.04, 38.89],
  zoom: 10.6,
});

function BikeShareStation(lon, lat, capacity) {
  this.type = "Feature";
  this.geometry = {};
  this.properties = {};
  this.geometry.type = "Point";
  this.geometry.coordinates = [lon, lat];
  this.properties.capacity = capacity;
}

function FeatureCollection(features) {
  this.type = "FeatureCollection";
  this.features = features;
}

function getCabiStations() {
  const stationArray = [];

  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
    );
    request.responseType = "json";
    request.send();
    request.onload = function getStations() {
      const { stations } = request.response.data;
      stations.forEach((station) => {
        const newStation = new BikeShareStation(
          station.lon,
          station.lat,
          station.capacity
        );
        stationArray.push(newStation);
      });
      resolve(stationArray);
    };
  });
}

function getDcNeighborhoods() {
  const neighborhoodsArray = [];

  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      "https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson"
    );
    request.responseType = "json";
    request.send();
    request.onload = () => {
      const neighborhoods = request.response.features;

      neighborhoods.forEach((neighborhood) => {
        neighborhoodsArray.push(neighborhood);
      });

      resolve(neighborhoodsArray);
    };
  });
}

function calculateBikesPerNeighborhood(bikeshareData, neighborhoods) {
  const bikesPerNeighborhoodGeoJSON = [];
  const cabiStations = new FeatureCollection(bikeshareData);
  neighborhoods.forEach((neighborhood) => {
    const polygon = turf.polygon(neighborhood.geometry.coordinates);
    const cabiWithin = turf.pointsWithinPolygon(cabiStations, polygon);

    let totalBikes = 0;
    cabiWithin.features.forEach((station) => {
      totalBikes += station.properties.capacity;
    });

    // eslint-disable-next-line no-param-reassign
    neighborhood.properties.cabiBikes = totalBikes;
    bikesPerNeighborhoodGeoJSON.push(neighborhood);
  });

  return new FeatureCollection(bikesPerNeighborhoodGeoJSON);
}

map.on("load", () => {
  const bikeshare = getCabiStations()
    .then((res) => res)
    .catch((err) => new Error(err));

  const dcNeighborhoods = getDcNeighborhoods()
    .then((res) => res)
    .catch((err) => new Error(err));

  Promise.all([bikeshare, dcNeighborhoods]).then((res) => {
    const bikesPerNeighborhood = calculateBikesPerNeighborhood(res[0], res[1]);

    map.addLayer({
      id: "cabibikes",
      type: "fill",
      source: {
        type: "geojson",
        data: bikesPerNeighborhood,
      },
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": {
          property: "cabiBikes",
          stops: [
            [0, "#F2F12D"],
            [10, "#EED322"],
            [20, "#E6B71E"],
            [50, "#DA9C20"],
            [100, "#CA8323"],
            [200, "#B86B25"],
            [300, "#A25626"],
            [400, "#8B4225"],
            [500, "#723122"],
          ],
        },
        "fill-opacity": 0.6,
        "fill-outline-color": "#FFF",
      },
    });
  });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mouseenter", "cabibikes", (e) => {
    popup
      .setLngLat(e.lngLat)
      .setHTML(
        `<h4>${e.features[0].properties.NBH_NAMES}</h4><p>${e.features[0].properties.cabiBikes} Capital Bikeshare bikes</p>`
      )
      .addTo(map);
  });

  map.on("mouseleave", "cabibikes", () => {
    popup.remove();
  });
});
