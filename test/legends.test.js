/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { extractColorStops } from "../legends";
import { spin } from "../constants";

test("Extract color stops from GL JS data expression", () => {
  const expectedArray = [
    [150, "#ff5435"],
    [125, "#ff662c"],
    [100, "#ff7723"],
    [75, "#ff8718"],
    [50, "#ff970c"],
    [25, "#ffa600"],
    [0, "rgb(255, 255, 255)"],
  ];

  expect(extractColorStops(spin.polygonFillColor)).toEqual(expectedArray);
});
