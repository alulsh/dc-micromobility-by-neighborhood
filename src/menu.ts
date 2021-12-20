import type { Service, CabiSubService } from "services";
import { services } from "./constants.js";
import { map } from "./map.js";

function clearMenuAndLayers(clickedLayer: string) {
  const menuDiv = <HTMLElement>document.getElementById("menu");
  menuDiv.childNodes.forEach((node: any) => {
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

function removeAllLegends() {
  services.forEach((service) => {
    const legend = <HTMLElement>(
      document.getElementById(`${service.polygonLayerId}-legend`)
    );
    legend.style.display = "none";
  });
}

function toggleLegend(clickedLayer: string, visible: boolean) {
  const legend = <HTMLElement>document.getElementById(`${clickedLayer}-legend`);
  if (visible) {
    legend.style.display = "";
  } else {
    legend.style.display = "none";
  }
}

function clickMenuEvent(link: HTMLElement, service: Service | CabiSubService) {
  const layerVisibility = map.getLayoutProperty(
    service.polygonLayerId,
    "visibility"
  );

  clearMenuAndLayers(service.polygonLayerId);
  removeAllPointLayers();

  if (layerVisibility === "visible") {
    link.classList.remove("active");
    map.setLayoutProperty(service.polygonLayerId, "visibility", "none");
    removeAllLegends();
    toggleLegend(service.polygonLayerId, false);
  } else {
    link.classList.add("active");
    map.setLayoutProperty(service.polygonLayerId, "visibility", "visible");
    map.setLayoutProperty(service.pointLayerId, "visibility", "visible");
    removeAllLegends();
    toggleLegend(service.polygonLayerId, true);
  }
}

function createMenuItem(service: Service | CabiSubService) {
  const link = document.createElement("a");
  link.href = "#";
  link.id = service.polygonLayerId;
  link.textContent = service.menuName;

  if (service.default) {
    link.className = "active";
  }

  const menuDiv = document.getElementById("menu");
  menuDiv?.appendChild(link);

  link.onclick = function click() {
    clickMenuEvent(<HTMLElement>this, service);
  };
}

function createMenu() {
  services.forEach((service) => {
    createMenuItem(<Service | CabiSubService>service);
  });
}

createMenu();
