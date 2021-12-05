/* eslint-disable import/extensions */
import { services } from "./constants.js";
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

function displayPointLayer(clickedLayer) {
  switch (clickedLayer) {
    case "total-spin-scooters":
      map.setLayoutProperty("spin-scooters-points", "visibility", "visible");
      break;
    case "total-helbiz-scooters":
      map.setLayoutProperty("helbiz-scooters-points", "visibility", "visible");
      break;
    case "cabi-bikes-availability":
    case "cabi-bikes-capacity":
      map.setLayoutProperty("cabi-stations-points", "visibility", "visible");
      break;
    default:
      break;
  }
}

function toggleLegend(clickedLayer, visible) {
  const legend = document.getElementById(`${clickedLayer}-legend`);
  if (visible) {
    legend.style.display = "";
  } else {
    legend.style.display = "none";
  }
}

function clickMenuEvent(link) {
  const clickedLayer = link.id;
  const layerVisibility = map.getLayoutProperty(
    `${clickedLayer}`,
    "visibility"
  );

  clearMenuAndLayers(clickedLayer);
  removeAllPointLayers();

  if (layerVisibility === "visible") {
    link.classList.remove("active");
    map.setLayoutProperty(clickedLayer, "visibility", "none");
    toggleLegend(clickedLayer, false);
  } else {
    link.classList.add("active");
    map.setLayoutProperty(clickedLayer, "visibility", "visible");
    toggleLegend(clickedLayer, true);
    displayPointLayer(clickedLayer);
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
    clickMenuEvent(this);
  };
}

function createMenu() {
  services.forEach((service) => {
    createMenuItem(service);
  });
}

createMenu();
