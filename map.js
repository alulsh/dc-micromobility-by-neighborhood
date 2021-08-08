/* eslint-disable prefer-destructuring */
/* eslint-disable strict */
/* eslint-disable import/extensions */

"use strict";

import {
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "./cabi.js";
import { getLimeBikes } from "./lime.js";
import { getSpinScooters } from "./spin.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-77.04, 38.89],
  zoom: 10.6,
});

function clearToggles(toggle, activeLayer) {
  const navMenu = toggle.parentElement;
  navMenu.childNodes.forEach((node) => {
    if (node.id !== activeLayer) {
      // eslint-disable-next-line no-param-reassign
      node.className = "";
      map.setLayoutProperty(node.id, "visibility", "none");
    }
  });
}

function clearLegends(clickedLayer) {
  const legends = document.getElementsByClassName("legend");
  let i;
  for (i = 0; i < legends.length; i++) {
    if (legends[i].id !== clickedLayer) {
      legends[i].style.display = "none";
    }
  }
}

function togglePointLayers(clickedLayer, visibility) {
  switch (clickedLayer) {
    case "total-lime-bikes":
      map.moveLayer("total-lime-bikes", "lime-bikes-points");
      map.setLayoutProperty("lime-bikes-points", "visibility", visibility);
      break;
    case "total-spin-scooters":
      map.moveLayer("total-spin-scooters", "spin-scooters-points");
      map.setLayoutProperty("spin-scooters-points", "visibility", visibility);
      break;
    case "cabi-bikes-availability":
    case "cabi-bikes-capacity":
      map.moveLayer("cabi-bikes-availability", "cabi-stations-points");
      map.moveLayer("cabi-bikes-capacity", "cabi-stations-points");
      map.setLayoutProperty("cabi-stations-points", "visibility", visibility);
      break;
    default:
      break;
  }
}

function createToggles() {
  const toggles = [
    ["Capital Bikeshare availability", "cabi-bikes-availability", "default"],
    ["Capital Bikeshare capacity", "cabi-bikes-capacity", "hidden"],
    ["Lime bikes", "total-lime-bikes", "hidden"],
    ["Spin scooters", "total-spin-scooters", "hidden"],
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

      const legend = document.getElementById(`${clickedLayer}-legend`);
      const visibility = map.getLayoutProperty(`${clickedLayer}`, "visibility");

      if (visibility === "visible") {
        clearToggles(this, clickedLayer);
        legend.style.display = "none";
        this.className = "";
        map.setLayoutProperty(`${clickedLayer}`, "visibility", "none");
        togglePointLayers(clickedLayer, "none");
      } else {
        clearToggles(this, clickedLayer);
        clearLegends(clickedLayer);
        legend.style.display = "";
        this.className = "active";
        map.setLayoutProperty(`${clickedLayer}`, "visibility", "visible");
        togglePointLayers(clickedLayer, "visible");
      }
    };

    const layers = document.getElementById("menu");
    layers.appendChild(link);
  });
}

function addCabiSource(stationGeoJSON) {
  return new Promise((resolve) => {
    map.addSource("cabi-stations-source", {
      type: "geojson",
      data: stationGeoJSON,
    });
    resolve(stationGeoJSON);
  });
}

function addNeighborhoodPolygons() {
  map.addSource("dc-neighborhoods-source", {
    type: "geojson",
    data: "https://opendata.arcgis.com/datasets/f6c703ebe2534fc3800609a07bad8f5b_17.geojson",
    generateId: true,
  });
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
}

function addLimeBikeLayer(limeBikeGeojson) {
  return new Promise((resolve) => {
    map.addSource("lime-bikes-source", {
      type: "geojson",
      data: limeBikeGeojson,
    });
    map.addLayer({
      id: "lime-bikes-points",
      type: "circle",
      source: "lime-bikes-source",
      layout: {
        visibility: "none",
      },
      minzoom: 12,
      paint: {
        "circle-color": "#50C878",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });
    map.addLayer({
      id: "total-lime-bikes",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalLimeBikes"],
          0,
          ["to-color", "rgb(255, 255, 255)"],
          5,
          ["to-color", "rgb(244, 255, 212)"],
          10,
          ["to-color", "rgb(233, 255, 170)"],
          15,
          ["to-color", "rgb(223, 255, 127)"],
          20,
          ["to-color", "rgb(212, 255, 85)"],
          25,
          ["to-color", "rgb(201, 255, 42)"],
          30,
          ["to-color", "rgb(191, 255, 0)"],
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "#DCDCDC",
      },
    });
    map.on("sourcedata", function sourceLoaded(e) {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve(limeBikeGeojson);
      }
    });
  });
}

function addSpinScootersLayer(spinScootersGeoJSON) {
  return new Promise((resolve) => {
    map.addSource("spin-scooters-source", {
      type: "geojson",
      data: spinScootersGeoJSON,
    });
    map.addLayer({
      id: "spin-scooters-points",
      type: "circle",
      source: "spin-scooters-source",
      layout: {
        visibility: "none",
      },
      minzoom: 12,
      paint: {
        "circle-color": "#EE4B2B",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });
    map.addLayer({
      id: "total-spin-scooters",
      type: "fill",
      source: "dc-neighborhoods-source",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "totalSpinScooters"],
          0,
          ["to-color", "rgb(255, 255, 255)"],
          25,
          ["to-color", "#ffa600"],
          50,
          ["to-color", "#ff970c"],
          75,
          ["to-color", "#ff8718"],
          100,
          ["to-color", "#ff7723"],
          125,
          ["to-color", "#ff662c"],
          150,
          ["to-color", "#ff5435"],
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "#DCDCDC",
      },
    });
    map.on("sourcedata", function sourceLoaded(e) {
      if (
        e.sourceId === "dc-neighborhoods-source" &&
        e.isSourceLoaded &&
        e.coord
      ) {
        resolve(spinScootersGeoJSON);
      }
    });
  });
}

function addCabiLayers(stationGeoJSON) {
  return new Promise((resolve) => {
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

function calculateCabiBikesPerPolygon(stationGeoJSON) {
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

function calculateLimeBikesPerPolygon(limeBikeGeojson) {
  return new Promise((resolve) => {
    const dcPolygons = map.queryRenderedFeatures({
      layers: ["dc-neighborhoods-polygons"],
    });
    dcPolygons.forEach((feature) => {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const limeBikesWithin = turf.pointsWithinPolygon(
        limeBikeGeojson,
        polygon
      );

      const totalLimeBikes = limeBikesWithin.features.length;

      map.setFeatureState(
        {
          source: "dc-neighborhoods-source",
          id: feature.id,
        },
        {
          totalLimeBikes,
        }
      );
    });
    resolve(dcPolygons);
  });
}

function calculateSpinScootersPerPolygon(spinScootersGeoJSON) {
  return new Promise((resolve) => {
    const dcPolygons = map.queryRenderedFeatures({
      layers: ["dc-neighborhoods-polygons"],
    });
    dcPolygons.forEach((feature) => {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const spinScootersWithin = turf.pointsWithinPolygon(
        spinScootersGeoJSON,
        polygon
      );

      const totalSpinScooters = spinScootersWithin.features.length;

      map.setFeatureState(
        {
          source: "dc-neighborhoods-source",
          id: feature.id,
        },
        {
          totalSpinScooters,
        }
      );
    });
    resolve(dcPolygons);
  });
}

function fetchBikeData() {
  const cabiStationInformation = getCabiStationInformation();
  const cabiStationStatus = getCabiStationStatus();
  getLimeBikes().then(addLimeBikeLayer).then(calculateLimeBikesPerPolygon);
  getSpinScooters()
    .then(addSpinScootersLayer)
    .then(calculateSpinScootersPerPolygon);

  Promise.all([cabiStationInformation, cabiStationStatus]).then((promises) => {
    const mergedData = mergeCabiStationJSON(promises[0], promises[1]);
    addCabiSource(mergedData)
      .then(addCabiLayers)
      .then(calculateCabiBikesPerPolygon);
  });
}

map.on("load", () => {
  addNeighborhoodPolygons();
  fetchBikeData();
  createToggles();
});

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

function getActiveMenuLayer() {
  const navMenu = document.getElementById("menu");
  let activeLayer;

  navMenu.childNodes.forEach((item) => {
    if (item.className === "active") {
      activeLayer = item.id;
    }
  });

  return activeLayer;
}

function calculatePercentageAvailable(totalBikesAvailable, totalBikeCapacity) {
  let percentageAvailable = (
    (totalBikesAvailable / totalBikeCapacity) *
    100
  ).toFixed(2);

  if (percentageAvailable === "Nan") {
    percentageAvailable = 0;
  }

  return percentageAvailable;
}

function generateNeighborhoodPolygonHTML(layerName, eventFeatures) {
  let header = `<h4>${eventFeatures.properties.NBH_NAMES}</h4>`;
  let paragraph;
  let percentageAvailable;

  switch (layerName) {
    case "total-lime-bikes":
      paragraph = `<p>${eventFeatures.state.totalLimeBikes} electric Lime bikes</p>`;
      break;
    case "total-spin-scooters":
      paragraph = `<p>${eventFeatures.state.totalSpinScooters} Spin scooters</p>`;
      break;
    case "cabi-bikes-availability":
    case "cabi-bikes-capacity":
      percentageAvailable = calculatePercentageAvailable(
        eventFeatures.state.totalBikesAvailable,
        eventFeatures.state.totalBikeCapacity
      );
      paragraph = `
      <p>
        ${percentageAvailable}% available</br>
        ${eventFeatures.state.totalBikesAvailable} bikes available</br>
        ${eventFeatures.state.totalBikeCapacity} bike capacity</br>
      </p>
      `;
      break;
    default:
      header = "";
      paragraph = `<p>No data selected. Select a data source on the left hand menu.</p>`;
      break;
  }

  const html = header + paragraph;

  return html;
}

map.on("mousemove", "dc-neighborhoods-polygons", (event) => {
  const activeLayer = getActiveMenuLayer();
  const html = generateNeighborhoodPolygonHTML(activeLayer, event.features[0]);
  popup.setLngLat(event.lngLat).setHTML(html).addTo(map);
});

function createPointLayerPopup(layerName) {
  map.on("mousemove", layerName, (event) => {
    let popupHTML;

    switch (layerName) {
      case "spin-scooters-points":
        popupHTML = `<h4>Spin ${event.features[0].properties.vehicleType}</h4>`;
        break;
      case "lime-bikes-points":
        popupHTML = `<h4>Lime ${event.features[0].properties.vehicleType}</h4>`;
        break;
      case "cabi-stations-points":
        popupHTML = `
          <h4>${event.features[0].properties.name}</h4>
          <p>
          ${event.features[0].properties.bikesAvailable} bikes available<br/>
          ${event.features[0].properties.docksAvailable} docks available<br/>
          ${event.features[0].properties.bikesDisabled} disabled bikes<br/>
          ${event.features[0].properties.docksDisabled} disabled docks<br/>
          ${event.features[0].properties.capacity} total bike capacity<br/>
          </p>
        `;
        break;
      default:
        break;
    }

    popup.setLngLat(event.lngLat).setHTML(popupHTML).addTo(map);
  });
}

createPointLayerPopup("spin-scooters-points");
createPointLayerPopup("lime-bikes-points");
createPointLayerPopup("cabi-stations-points");

const popupLayers = [
  "spin-scooters-points",
  "lime-bikes-points",
  "cabi-stations-points",
  "dc-neighborhoods-polygons",
];

function removePopup(layerName) {
  map.on("mouseleave", layerName, () => {
    popup.remove();
  });
}

popupLayers.forEach((layer) => {
  removePopup(layer);
});

export { addCabiSource, fetchBikeData };
