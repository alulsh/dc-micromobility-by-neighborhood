/* eslint-disable import/extensions */
import type { Service, ColorStopExpression } from "services";
import { services } from "../dist/constants.js";

declare interface ColorStop {
  interval: string | number;
  color: string | number;
}

function extractColorStops(expression: ColorStopExpression) {
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

function createHeader(legend: HTMLElement, vehicleType: string) {
  const header = document.createElement("h4");
  header.innerText = vehicleType;
  legend.appendChild(header);
}

function createColorStop(legend: HTMLElement, colorStop: ColorStop) {
  const div = document.createElement("div");
  div.innerText = <string>colorStop.interval;
  const span = document.createElement("span");
  span.style.backgroundColor = <string>colorStop.color;
  div.insertAdjacentHTML("afterbegin", span.outerHTML);
  legend.appendChild(div);
}

function createColorStops(service: Service, legend: HTMLElement) {
  const colorStops = extractColorStops(service.polygonFillColor);
  colorStops.forEach((colorStop) => {
    createColorStop(legend, { interval: colorStop[0], color: colorStop[1] });
  });
}

function createLegend(service: Service) {
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

services.forEach((service: Service) => {
  createLegend(service);
});

// eslint-disable-next-line import/prefer-default-export
export { extractColorStops };
