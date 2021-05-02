import { expect, test } from "@jest/globals";
import { convertToGeoJSON } from "../map";
import { cabiStationInformationMock } from "./fixtures";

test("Converts Capital Bikeshare JSON to valid GeoJSON", () => {
  expect(convertToGeoJSON(cabiStationInformationMock.data.stations)).toEqual({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          coordinates: [-77.05323, 38.858971],
          type: "Point",
        },
        properties: {
          capacity: 15,
          name: "Eads St & 15th St S",
          regionId: "41",
        },
      },
      {
        type: "Feature",
        geometry: {
          coordinates: [-77.05332, 38.85725],
          type: "Point",
        },
        properties: {
          capacity: 11,
          name: "18th St & S Eads St",
          regionId: "41",
        },
      },
      {
        type: "Feature",
        geometry: {
          coordinates: [-77.049232, 38.856425],
          type: "Point",
        },
        properties: {
          capacity: 17,
          name: "Crystal Dr & 20th St S",
          regionId: "41",
        },
      },
    ],
  });
});
