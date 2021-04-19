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

function convertToGeoJSON(bikeshareJSON) {
  const newStationArray = [];
  const stationArray = bikeshareJSON;

  stationArray.forEach((station) => {
    const newStation = new BikeShareStation(
      station.lon,
      station.lat,
      station.capacity
    );
    newStationArray.push(newStation);
  });
  return new FeatureCollection(newStationArray);
}

function getCabiStationJSON() {
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
      const stationGeoJSON = convertToGeoJSON(stations);
      resolve(stationGeoJSON);
    };
  });
}

function addCabiSource(stationGeoJSON) {
  return new Promise((resolve) => {
    map.addSource("cabi-stations-source", {
      type: "geojson",
      data: stationGeoJSON,
    });
    map.addLayer({
      id: "cabi-stations-points",
      type: "circle",
      source: "cabi-stations-source",
    });
    resolve(stationGeoJSON);
  });
}

function addDcNeighborhoodSource(stationGeoJSON) {
  return new Promise((resolve) => {
    map.addSource("dc-neighborhoods-source", {
      type: "geojson",
      data:
        "https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson",
      generateId: true,
    });

    map.addLayer({
      id: "dc-neighborhoods-polygons",
      type: "fill",
      source: "dc-neighborhoods-source",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalBikes"],
          0,
          ["to-color", "#F2F12D"],
          10,
          ["to-color", "#EED322"],
          20,
          ["to-color", "#E6B71E"],
          50,
          ["to-color", "#DA9C20"],
          100,
          ["to-color", "#CA8323"],
          200,
          ["to-color", "#B86B25"],
          300,
          ["to-color", "#A25626"],
          400,
          ["to-color", "#8B4225"],
          500,
          ["to-color", "#723122"],
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "#FFF",
      },
    });

    map.on("sourcedata", function sourceLoaded(e) {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve(stationGeoJSON);
      }
    });
  });
}

function getPolygons(stationGeoJSON) {
  return new Promise((resolve) => {
    const dcPolygons = map.queryRenderedFeatures({
      layers: ["dc-neighborhoods-polygons"],
    });
    dcPolygons.forEach((feature) => {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const cabiWithin = turf.pointsWithinPolygon(stationGeoJSON, polygon);

      let totalBikes = 0;
      cabiWithin.features.forEach((station) => {
        totalBikes += station.properties.capacity;
      });

      console.log(
        `${totalBikes} in neighborhood ${feature.properties.NBH_NAMES} with id ${feature.id}`
      );

      map.setFeatureState(
        {
          source: "dc-neighborhoods-source",
          id: feature.id,
        },
        {
          totalBikes,
        }
      );
    });
    resolve(dcPolygons);
  });
}

map.on("load", () => {
  getCabiStationJSON()
    .then((stations) => addCabiSource(stations))
    .then(addDcNeighborhoodSource)
    .then(getPolygons);
});
