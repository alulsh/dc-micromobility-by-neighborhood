/* eslint-disable import/extensions */
import { services } from "./dist/constants.js";
import { map } from "./map.js";

function clearMenuAndLayers(clickedLayer) {
  const menuDiv = document.getElementById("menu");
  menuDiv.childNodes.forEach((node) => {
    if (node.id !== clickedLayer) {
      node.classList.remove("active");
      map.setLayoutProperty(node.id, "visibility", "none");
    }
  });
}

function removeAllPointLayers() {
  services.forEach((service) => {
    map.setLayoutProperty(service.pointLayerId, "visibility", "none");
  });
}

function toggleLegend(clickedLayer, visible) {
  const legend = document.getElementById(`${clickedLayer}-legend`);
  if (visible) {
    legend.style.display = "";
  } else {
    legend.style.display = "none";
  }
}

function clickMenuEvent(link, service) {
  const layerVisibility = map.getLayoutProperty(
    service.polygonLayerId,
    "visibility"
  );

  clearMenuAndLayers(service.polygonLayerId);
  removeAllPointLayers();

  if (layerVisibility === "visible") {
    link.classList.remove("active");
    map.setLayoutProperty(service.polygonLayerId, "visibility", "none");
    toggleLegend(service.polygonLayerId, false);
  } else {
    link.classList.add("active");
    map.setLayoutProperty(service.polygonLayerId, "visibility", "visible");
    map.setLayoutProperty(service.pointLayerId, "visibility", "visible");
    toggleLegend(service.polygonLayerId, true);
  }
}

function createMenuItem(service) {
  const link = document.createElement("a");
  link.href = "#";
  link.id = service.polygonLayerId;
  link.textContent = service.menuName;

  if (service.default) {
    link.className = "active";
  }

  const menuDiv = document.getElementById("menu");
  menuDiv.appendChild(link);

  link.onclick = function click() {
    clickMenuEvent(this, service);
  };
}

function createMenu() {
  services.forEach((service) => {
    createMenuItem(service);
  });
}

createMenu();
