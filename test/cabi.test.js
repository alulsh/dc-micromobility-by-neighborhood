import { expect, test, jest, beforeEach } from "@jest/globals";
import { convertToGeoJSON, getCabiStationInformation } from "../cabi";
import { cabiStationInformationMock, cabiStationGeoJSON } from "./fixtures";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(cabiStationInformationMock),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test("Converts Capital Bikeshare JSON to valid GeoJSON", () => {
  expect(convertToGeoJSON(cabiStationInformationMock.data.stations)).toEqual(
    cabiStationGeoJSON
  );
});

test("Requests Capital Bikeshare station information", () => {
  return getCabiStationInformation().then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
    );
    expect(data).toEqual(cabiStationGeoJSON);
  });
});
