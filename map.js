/* eslint-disable prefer-destructuring */
/* eslint-disable strict */
/* eslint-disable import/extensions */

"use strict";

import {
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "./cabi.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-77.04, 38.89],
  zoom: 10.6,
});

function createToggles() {
  const toggles = [
    ["Capital Bikeshare availability", "cabi-bikes-availability", "default"],
    ["Capital Bikeshare capacity", "cabi-bikes-capacity", "hidden"],
  ];

  toggles.forEach((toggle) => {
    const link = document.createElement("a");
    link.href = "#";
    link.id = toggle[1];
    link.textContent = toggle[0];
    if (toggle[2] === "default") {
      link.className = "active";
    }

    link.onclick = function toggleLayers(event) {
      const clickedLayer = this.id;
      event.preventDefault();
      event.stopPropagation();

      const legend = document.getElementById("cabibikes-legend");
      const visibility = map.getLayoutProperty(`${clickedLayer}`, "visibility");

      if (visibility === "visible") {
        legend.style.display = "none";
        this.className = "";
        map.setLayoutProperty(`${clickedLayer}`, "visibility", "none");
      } else {
        legend.style.display = "";
        this.className = "active";
        map.setLayoutProperty(`${clickedLayer}`, "visibility", "visible");
      }
    };

    const layers = document.getElementById("menu");
    layers.appendChild(link);
  });
}

function addSources(stationGeoJSON) {
  return new Promise((resolve) => {
    map.addSource("cabi-stations-source", {
      type: "geojson",
      data: stationGeoJSON,
    });
    map.addSource("dc-neighborhoods-source", {
      type: "geojson",
      data: "https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson",
      generateId: true,
    });
    resolve(stationGeoJSON);
  });
}

function addLayers(stationGeoJSON) {
  return new Promise((resolve) => {
    map.addLayer({
      id: "dc-neighborhoods-polygons",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-opacity": 0,
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

    map.addLayer({
      id: "cabi-bikes-availability",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalBikesAvailable"],
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
      id: "cabi-bikes-capacity",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalBikeCapacity"],
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

function calculateBikesPerPolygon(stationGeoJSON) {
  return new Promise((resolve) => {
    const dcPolygons = map.queryRenderedFeatures({
      layers: ["dc-neighborhoods-polygons"],
    });
    dcPolygons.forEach((feature) => {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const cabiWithin = turf.pointsWithinPolygon(stationGeoJSON, polygon);

      let totalBikeCapacity = 0;
      let totalBikesAvailable = 0;
      cabiWithin.features.forEach((station) => {
        totalBikeCapacity += station.properties.capacity;
        totalBikesAvailable += station.properties.bikesAvailable;
      });

      map.setFeatureState(
        {
          source: "dc-neighborhoods-source",
          id: feature.id,
        },
        {
          totalBikeCapacity,
          totalBikesAvailable,
        }
      );
    });
    resolve(dcPolygons);
  });
}

function fetchBikeData() {
  const cabiStationInformation = getCabiStationInformation();
  const cabiStationStatus = getCabiStationStatus();

  Promise.all([cabiStationInformation, cabiStationStatus]).then((promises) => {
    const mergedData = mergeCabiStationJSON(promises[0], promises[1]);
    addSources(mergedData).then(addLayers).then(calculateBikesPerPolygon);
  });
}

map.on("load", () => {
  fetchBikeData();
  createToggles();
});

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on("mousemove", "dc-neighborhoods-polygons", (event) => {
  let percentageAvailable = (
    (event.features[0].state.totalBikesAvailable /
      event.features[0].state.totalBikeCapacity) *
    100
  ).toFixed(2);

  if (percentageAvailable === "NaN") {
    percentageAvailable = 0;
  }

  const html = `
      <h4>${event.features[0].properties.NBH_NAMES}</h4>
      <p>
      ${percentageAvailable}% available</br>
      ${event.features[0].state.totalBikesAvailable} bikes available</br>
      ${event.features[0].state.totalBikeCapacity} bike capacity</br>
      </p>
    `;
  popup.setLngLat(event.lngLat).setHTML(html).addTo(map);
});

map.on("mouseleave", "dc-neighborhoods-polygons", () => {
  popup.remove();
});

map.on("mousemove", "cabi-stations-points", (event) => {
  const html = `
  <h4>${event.features[0].properties.name}</h4>
  <p>
  ${event.features[0].properties.bikesAvailable} bikes available<br/>
  ${event.features[0].properties.docksAvailable} docks available<br/>
  ${event.features[0].properties.bikesDisabled} disabled bikes<br/>
  ${event.features[0].properties.docksDisabled} disabled docks<br/>
  ${event.features[0].properties.capacity} total bike capacity<br/>
  </p>
  `;
  popup.setLngLat(event.lngLat).setHTML(html).addTo(map);
});

map.on("mouseleave", "cabi-stations-points", () => {
  popup.remove();
});

export { addSources, fetchBikeData };
