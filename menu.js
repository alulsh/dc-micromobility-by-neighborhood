/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
import { services } from "./constants.js";
import { map } from "./map.js";

function clearMenuItems(menuItem, activeLayer) {
  const navMenu = menuItem.parentElement;
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

function removeAllPointLayers() {
  services.forEach((service) => {
    map.setLayoutProperty(service.pointLayerId, "visibility", "none");
  });
}

function togglePointLayers(clickedLayer) {
  removeAllPointLayers();

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

function createMenuLink(service) {
  const link = document.createElement("a");
  link.href = "#";
  link.id = service.polygonLayerId;
  link.textContent = service.menuName;

  if (service.default) {
    link.className = "active";
  }

  return link;
}

function createMenu() {
  services.forEach((service) => {
    const menuLink = createMenuLink(service);
    const menuDiv = document.getElementById("menu");
    menuDiv.appendChild(menuLink);

    menuLink.onclick = function toggleLayers(event) {
      const clickedLayer = this.id;
      event.preventDefault();
      event.stopPropagation();

      const legend = document.getElementById(`${clickedLayer}-legend`);
      const visibility = map.getLayoutProperty(`${clickedLayer}`, "visibility");

      if (visibility === "visible") {
        clearMenuItems(this, clickedLayer);
        legend.style.display = "none";
        this.className = "";
        map.setLayoutProperty(`${clickedLayer}`, "visibility", "none");
      } else {
        clearMenuItems(this, clickedLayer);
        clearLegends(clickedLayer);
        legend.style.display = "";
        this.className = "active";
        map.setLayoutProperty(`${clickedLayer}`, "visibility", "visible");
        togglePointLayers(clickedLayer);
      }
    };
  });
}

createMenu();
