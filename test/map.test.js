import { expect, test } from "@jest/globals";
import { convertToGeoJSON, getCabiStationInformation } from "../map";
import { cabiStationInformationMock, cabiStationGeoJSON } from "./fixtures";

test("Converts Capital Bikeshare JSON to valid GeoJSON", () => {
  expect(convertToGeoJSON(cabiStationInformationMock.data.stations)).toEqual(
    cabiStationGeoJSON
  );
});

test("Requests Capital Bikeshare station information", () => {
  return getCabiStationInformation().then((data) => {
    expect(data).toBe(cabiStationGeoJSON);
  });
});
