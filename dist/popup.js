import { map } from "./map.js";
import { services } from "./constants.js";
import calculatePercentageAvailable from "./utilities.js";
function checkIfDisabled(properties) {
    let disabledText = "";
    if (properties.isDisabled === 1) {
        disabledText = "Disabled ";
    }
    return disabledText;
}
function generatePointPopUpHTML(service, eventFeatures) {
    let html;
    if (service.name === "Capital Bikeshare") {
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
        html = `<p>${checkIfDisabled(eventFeatures.properties)} ${service.name} ${eventFeatures.properties.vehicleType}</p>`;
    }
    return html;
}
function generatePolygonPopupHTML(service, eventFeatures) {
    let html = `<h4>${eventFeatures.properties.NBH_NAMES}</h4>`;
    if (service.name === "Capital Bikeshare") {
        const percentageAvailable = calculatePercentageAvailable(eventFeatures.state.totalBikesAvailable, eventFeatures.state.totalBikeCapacity);
        html += `
      <p>
        ${percentageAvailable.string}% available</br>
        ${eventFeatures.state.totalBikesAvailable} bikes available</br>
        ${eventFeatures.state.totalBikeCapacity} bike capacity</br>
      </p>
      `;
    }
    else {
        html += `<p>${eventFeatures.state[service.featureStateName]} ${service.name} ${service.vehicleType}</br>
    ${eventFeatures.state[service.featureStateDisabledName]} disabled ${service.name} ${service.vehicleType} 
    </p>`;
    }
    return html;
}
function extractServiceName(textContent) {
    let serviceName;
    if ((textContent === null || textContent === void 0 ? void 0 : textContent.substring(0, 7)) === "Capital") {
        serviceName = "Capital Bikeshare";
    }
    else {
        const lastSpace = textContent === null || textContent === void 0 ? void 0 : textContent.lastIndexOf(" ");
        serviceName = textContent === null || textContent === void 0 ? void 0 : textContent.substring(0, lastSpace);
    }
    return serviceName;
}
function getActiveService() {
    let activeService;
    const activeElements = document.getElementsByClassName("active");
    const { textContent } = activeElements[0];
    if (textContent) {
        const serviceName = extractServiceName(textContent);
        activeService = services.filter((service) => service.name === serviceName);
    }
    return activeService[0];
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
        const activeService = getActiveService();
        const popupHTML = generatePolygonPopupHTML(activeService, event.features[0]);
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
