/* eslint-disable import/extensions */
import { map } from "./map.js";

function calculatePercentageAvailable(totalBikesAvailable, totalBikeCapacity) {
  let percentageAvailable = (
    (totalBikesAvailable / totalBikeCapacity) *
    100
  ).toFixed(2);

  if (percentageAvailable === "NaN") {
    percentageAvailable = 0;
  }

  return percentageAvailable;
}

function generatePopupHTML(layerName, eventFeatures) {
  let header = `<h4>${eventFeatures.properties.NBH_NAMES}</h4>`;
  let paragraph;
  let percentageAvailable;

  switch (layerName) {
    case "lime-bikes-points":
      header = "";
      paragraph = `<p>Lime ${eventFeatures.properties.vehicleType}</p>`;
      break;
    case "total-lime-bikes":
      paragraph = `<p>${eventFeatures.state.totalLimeBikes} electric Lime bikes</p>`;
      break;
    case "spin-scooters-points":
      header = "";
      paragraph = `<p>Spin ${eventFeatures.properties.vehicleType}</p>`;
      break;
    case "bird-scooters-points":
      header = "";
      paragraph = `<p>Bird ${eventFeatures.properties.vehicleType}</p>`;
      break;
    case "total-spin-scooters":
      paragraph = `<p>${eventFeatures.state.totalSpinScooters} Spin scooters</p>`;
      break;
    case "total-bird-scooters":
      paragraph = `<p>${eventFeatures.state.totalBirdScooters} Bird scooters</p>`;
      break;
    case "cabi-stations-points":
      header = `<h4>${eventFeatures.properties.name}</h4>`;
      paragraph = `
            <p>
            ${eventFeatures.properties.bikesAvailable} bikes available<br/>
            ${eventFeatures.properties.docksAvailable} docks available<br/>
            ${eventFeatures.properties.bikesDisabled} disabled bikes<br/>
            ${eventFeatures.properties.docksDisabled} disabled docks<br/>
            ${eventFeatures.properties.capacity} total bike capacity<br/>
            </p>
          `;
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

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

/* 
  dc-neighborhoods-polygon layer mouse events need to be declared separately
  or else the point layer popups will not load
*/

map.on("mousemove", "dc-neighborhoods-polygons", (event) => {
  const activeLayer = getActiveMenuLayer();
  const popupHTML = generatePopupHTML(activeLayer, event.features[0]);
  popup.setLngLat(event.lngLat).setHTML(popupHTML).addTo(map);
});

map.on("mouseleave", "dc-neighborhoods-polygons", () => {
  popup.remove();
});

function createLayerPopup(layerName) {
  map.on("mousemove", layerName, (event) => {
    const popupHTML = generatePopupHTML(layerName, event.features[0]);
    popup.setLngLat(event.lngLat).setHTML(popupHTML).addTo(map);
  });
}

function removePopup(layerName) {
  map.on("mouseleave", layerName, () => {
    popup.remove();
  });
}

const popupLayers = [
  "spin-scooters-points",
  "bird-scooters-points",
  "lime-bikes-points",
  "cabi-stations-points",
];

popupLayers.forEach((layer) => {
  createLayerPopup(layer);
  removePopup(layer);
});
