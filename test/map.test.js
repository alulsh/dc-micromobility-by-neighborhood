/* eslint-disable no-unused-vars */
import { expect, test, jest } from "@jest/globals";
import { convertToGeoJSON, getCabiStationInformation } from "../map";
import { cabiStationInformationMock, cabiStationGeoJSON } from "./fixtures";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(cabiStationInformationMock),
  })
);

test("Converts Capital Bikeshare JSON to valid GeoJSON", () => {
  expect(convertToGeoJSON(cabiStationInformationMock.data.stations)).toEqual(
    cabiStationGeoJSON
  );
});

test("Requests Capital Bikeshare station information", () => {
  return getCabiStationInformation().then((data) => {
    expect(data).toEqual(cabiStationGeoJSON);
  });
});
