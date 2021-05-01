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

function BikeShareStation(lon, lat, name, regionId, capacity) {
  this.type = "Feature";
  this.geometry = {};
  this.properties = {};
  this.geometry.type = "Point";
  this.geometry.coordinates = [lon, lat];
  this.properties.name = name;
  this.properties.regionId = regionId;
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
      station.name,
      station.region_id,
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
    map.addSource("dc-neighborhoods-source", {
      type: "geojson",
      data:
        "https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson",
      generateId: true,
    });
    resolve(stationGeoJSON);
  });
}

function addDcNeighborhoodSource(stationGeoJSON) {
  return new Promise((resolve) => {
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

    map.addLayer({
      id: "cabi-stations-points",
      type: "circle",
      source: "cabi-stations-source",
      minzoom: 12,
      // regionId 42 is for Washington, D.C.
      filter: ["==", "regionId", "42"],
      paint: {
        "circle-color": "#363636",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
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

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on("mousemove", "dc-neighborhoods-polygons", (event) => {
  popup
    .setLngLat(event.lngLat)
    .setHTML(
      `<h4>${event.features[0].properties.NBH_NAMES}</h4><p>${event.features[0].state.totalBikes} Capital Bikeshare bikes</p>`
    )
    .addTo(map);
});

map.on("mouseleave", "dc-neighborhoods-polygons", () => {
  popup.remove();
});

map.on("mousemove", "cabi-stations-points", (event) => {
  popup
    .setLngLat(event.lngLat)
    .setHTML(
      `<h4>${event.features[0].properties.name}</h4><p>${event.features[0].properties.capacity} bike capacity</p>`
    )
    .addTo(map);
});

map.on("mouseleave", "cabi-stations-points", () => {
  popup.remove();
});
