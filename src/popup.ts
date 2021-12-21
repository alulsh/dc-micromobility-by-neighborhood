import type { Service, CabiSubService } from "services";
import { map } from "./map.js";
import { services } from "./constants.js";

function calculatePercentageAvailable(
  totalBikesAvailable: number,
  totalBikeCapacity: number
) {
  let percentageAvailable: number;

  if (totalBikesAvailable === 0) {
    percentageAvailable = 0;
  } else {
    percentageAvailable = (totalBikesAvailable / totalBikeCapacity) * 100;
  }

  return percentageAvailable.toFixed(2);
}

function generatePointPopUpHTML(
  service: Service | CabiSubService,
  eventFeatures: any
) {
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
  } else {
    html = `<p>${service.service} ${eventFeatures.properties.vehicleType}</p>`;
  }

  return html;
}

function generatePolygonPopupHTML(
  service: Service | CabiSubService,
  eventFeatures: any
) {
  let html = `<h4>${eventFeatures.properties.NBH_NAMES}</h4>`;

  if (service.service === "Capital Bikeshare") {
    const percentageAvailable = calculatePercentageAvailable(
      eventFeatures.state.totalBikesAvailable,
      eventFeatures.state.totalBikeCapacity
    );
    html += `
      <p>
        ${percentageAvailable}% available</br>
        ${eventFeatures.state.totalBikesAvailable} bikes available</br>
        ${eventFeatures.state.totalBikeCapacity} bike capacity</br>
      </p>
      `;
  } else {
    html += `<p>${eventFeatures.state[service.featureStateName]} ${
      service.service
    } ${service.vehicleType}</p>`;
  }

  return html;
}

function getActiveService() {
  const activeElements = document.getElementsByClassName("active");
  const { textContent } = activeElements[0];
  const lastSpace = textContent?.lastIndexOf(" ");
  const serviceName = textContent?.substring(0, lastSpace);

  const activeService = services.filter(
    (service) => service.service === serviceName
  );

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
    const popupHTML = generatePolygonPopupHTML(
      activeService,
      event.features[0]
    );
    popup.setLngLat(event.lngLat).setHTML(popupHTML).addTo(map);
  }
});

map.on("mouseleave", "dc-neighborhoods-polygons", () => {
  popup.remove();
});

function createLayerPopup(service: Service | CabiSubService) {
  map.on("mousemove", service.pointLayerId, (event) => {
    if (event.features) {
      const popupHTML = generatePointPopUpHTML(service, event.features[0]);
      popup.setLngLat(event.lngLat).setHTML(popupHTML).addTo(map);
    }
  });
}

function removePopup(layerName: string) {
  map.on("mouseleave", layerName, () => {
    popup.remove();
  });
}

services.forEach((service) => {
  createLayerPopup(service);
  removePopup(service.pointLayerId);
});
