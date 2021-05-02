import { expect, test } from "@jest/globals";
import { convertToGeoJSON } from "../map";
import { cabiStationInformationMock, cabiStationGeoJSON } from "./fixtures";

test("Converts Capital Bikeshare JSON to valid GeoJSON", () => {
  expect(convertToGeoJSON(cabiStationInformationMock.data.stations)).toEqual(
    cabiStationGeoJSON
  );
});
