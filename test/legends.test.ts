/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { ColorStopExpression } from "services";
import extractColorStops from "../src/legends";
import { spin } from "../src/constants.js";

test("Extract color stops from GL JS data expression", () => {
  const expectedArray = [
    [200, "#ff6b4a"],
    [150, "#ff6f4e"],
    [100, "#ff8565"],
    [75, "#ff9b7e"],
    [50, "#ffaf97"],
    [25, "#ffc3b0"],
    [0, "#ffd7cb"],
  ];

  expect(extractColorStops(<ColorStopExpression>spin.polygonFillColor)).toEqual(
    expectedArray
  );
});
