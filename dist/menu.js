import { services } from "./constants.js";
import { map } from "./map.js";
function clearMenuAndLayers(clickedLayer) {
    const menu = document.getElementById("menu");
    menu.childNodes.forEach((node) => {
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
        const legend = (document.getElementById(`${service.polygonLayerId}-legend`));
        legend.style.display = "none";
    });
}
function toggleLegend(clickedLayer, visible) {
    const legend = document.getElementById(`${clickedLayer}-legend`);
    if (visible) {
        legend.style.display = "";
    }
    else {
        legend.style.display = "none";
    }
}
function clickMenuEvent(link, service) {
    const layerVisibility = map.getLayoutProperty(service.polygonLayerId, "visibility");
    clearMenuAndLayers(service.polygonLayerId);
    removeAllPointLayers();
    if (layerVisibility === "visible") {
        link.classList.remove("active");
        map.setLayoutProperty(service.polygonLayerId, "visibility", "none");
        removeAllLegends();
        toggleLegend(service.polygonLayerId, false);
    }
    else {
        link.classList.add("active");
        map.setLayoutProperty(service.polygonLayerId, "visibility", "visible");
        map.setLayoutProperty(service.pointLayerId, "visibility", "visible");
        removeAllLegends();
        toggleLegend(service.polygonLayerId, true);
    }
}
function createMenuItem(service) {
    const link = document.createElement("a");
    link.href = "#";
    link.id = service.polygonLayerId;
    link.textContent = service.menuText;
    if (service.default) {
        link.className = "active";
    }
    const menu = document.getElementById("menu");
    menu === null || menu === void 0 ? void 0 : menu.appendChild(link);
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
