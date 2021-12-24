import { services } from "./constants.js";
function extractColorStops(expression) {
    return [
        [expression[15], expression[16][1]],
        [expression[13], expression[14][1]],
        [expression[11], expression[12][1]],
        [expression[9], expression[10][1]],
        [expression[7], expression[8][1]],
        [expression[5], expression[6][1]],
        [expression[3], expression[4][1]],
    ];
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function createHeader(legend, vehicleType) {
    const header = document.createElement("h4");
    header.innerText = capitalizeFirstLetter(vehicleType);
    legend.appendChild(header);
}
function createColorStop(legend, colorStop) {
    const div = document.createElement("div");
    div.innerText = colorStop.interval;
    if (colorStop.percent) {
        div.innerText += "%";
    }
    const span = document.createElement("span");
    span.style.backgroundColor = colorStop.color;
    div.insertAdjacentHTML("afterbegin", span.outerHTML);
    legend.appendChild(div);
}
function createColorStops(service, legend) {
    const colorStops = extractColorStops(service.polygonFillColor);
    colorStops.forEach((colorStop) => {
        if (service.polygonLayerId === "cabi-bikes-percent-available") {
            createColorStop(legend, {
                interval: colorStop[0],
                color: colorStop[1],
                percent: true,
            });
        }
        else {
            createColorStop(legend, {
                interval: colorStop[0],
                color: colorStop[1],
                percent: false,
            });
        }
        // createColorStop(legend, { interval: colorStop[0], color: colorStop[1] });
    });
}
function createLegend(service) {
    const legend = document.createElement("div");
    legend.className = "legend";
    legend.id = `${service.polygonLayerId}-legend`;
    if (service.default === false) {
        legend.style.display = "none";
    }
    createHeader(legend, service.vehicleType);
    createColorStops(service, legend);
    document.body.appendChild(legend);
}
services.forEach((service) => {
    createLegend(service);
});
export default extractColorStops;
