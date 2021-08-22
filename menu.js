/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
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

function createMenuLink(service) {
  const link = document.createElement("a");
  link.href = "#";
  link.id = service[1];
  link.textContent = service[0];
  if (service[2] === "default") {
    link.className = "active";
  }

  return link;
}

function createMenu() {
  const micromobilityServices = [
    ["Lime bikes", "total-lime-bikes", "default"],
    ["Spin scooters", "total-spin-scooters", "hidden"],
    ["Capital Bikeshare availability", "cabi-bikes-availability", "hidden"],
    ["Capital Bikeshare capacity", "cabi-bikes-capacity", "hidden"],
  ];

  micromobilityServices.forEach((service) => {
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
        togglePointLayers(clickedLayer, "none");
      } else {
        clearMenuItems(this, clickedLayer);
        clearLegends(clickedLayer);
        legend.style.display = "";
        this.className = "active";
        map.setLayoutProperty(`${clickedLayer}`, "visibility", "visible");
        togglePointLayers(clickedLayer, "visible");
      }
    };
  });
}

createMenu();
