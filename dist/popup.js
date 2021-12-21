import { map } from "./map.js";
import { services } from "./constants.js";
function calculatePercentageAvailable(totalBikesAvailable, totalBikeCapacity) {
    let percentageAvailable;
    if (totalBikesAvailable === 0) {
        percentageAvailable = 0;
    }
    else {
        percentageAvailable = (totalBikesAvailable / totalBikeCapacity) * 100;
    }
    return percentageAvailable.toFixed(2);
}
function generatePointPopUpHTML(service, eventFeatures) {
    let html;
    if (service.service === "Capital Bikeshare") {
        html = `<h4>${eventFeatures.properties.name}</h4>
            <p>
            ${eventFeatures.properties.bikesAvailable} bikes available<br/>
            ${eventFeatures.properties.docksAvailable} docks available<br/>
            ${eventFeatures.properties.bikesDisabled} disabled bikes<br/>
            ${eventFeatures.properties.docksDisabled} disabled docks<br/>
            ${eventFeatures.properties.capacity} total bike capacity<br/>
            </p>
          `;
    }
    else {
        html = `<p>${service.service} ${eventFeatures.properties.vehicleType}</p>`;
    }
    return html;
}
function generatePopupHTML(layerName, eventFeatures) {
    let header = `<h4>${eventFeatures.properties.NBH_NAMES}</h4>`;
    let paragraph;
    let percentageAvailable;
    switch (layerName) {
        case "total-spin-scooters":
            paragraph = `<p>${eventFeatures.state.totalSpinScooters} Spin scooters</p>`;
            break;
        case "total-helbiz-scooters":
            paragraph = `<p>${eventFeatures.state.totalHelbizScooters} Helbiz scooters</p>`;
            break;
        case "cabi-bikes-availability":
        case "cabi-bikes-capacity":
            percentageAvailable = calculatePercentageAvailable(eventFeatures.state.totalBikesAvailable, eventFeatures.state.totalBikeCapacity);
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
    navMenu === null || navMenu === void 0 ? void 0 : navMenu.childNodes.forEach((item) => {
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
    if (event.features) {
        const activeLayer = getActiveMenuLayer();
        const popupHTML = generatePopupHTML(activeLayer, event.features[0]);
        popup.setLngLat(event.lngLat).setHTML(popupHTML).addTo(map);
    }
});
map.on("mouseleave", "dc-neighborhoods-polygons", () => {
    popup.remove();
});
function createLayerPopup(service) {
    map.on("mousemove", service.pointLayerId, (event) => {
        if (event.features) {
            const popupHTML = generatePointPopUpHTML(service, event.features[0]);
            popup.setLngLat(event.lngLat).setHTML(popupHTML).addTo(map);
        }
    });
}
function removePopup(layerName) {
    map.on("mouseleave", layerName, () => {
        popup.remove();
    });
}
services.forEach((service) => {
    createLayerPopup(service);
    removePopup(service.pointLayerId);
});
