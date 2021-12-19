import { expect, test, jest, afterEach } from "@jest/globals";
import {
  convertToGeoJSON,
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
} from "../src/cabi";
import {
  cabiStationInformationMock,
  cabiStationGeoJSON,
  cabiStationStatus,
  mergedCabiGeoJSON,
} from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

// https://stackoverflow.com/questions/44180693/jest-mock-and-typescript/60376517#comment78899968_44180693
// eslint-disable-next-line @typescript-eslint/ban-types
declare let global: { fetch: {} };

test("Converts Capital Bikeshare JSON to valid GeoJSON", () => {
  expect(convertToGeoJSON(cabiStationInformationMock.data.stations)).toEqual(
    cabiStationGeoJSON
  );
});

test("Requests Capital Bikeshare station information", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(cabiStationInformationMock),
    })
  );

  return getCabiStationInformation().then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
    );
    expect(data).toEqual(cabiStationGeoJSON);
  });
});

test("Requests Capital Bikeshare station status", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(cabiStationStatus),
    })
  );

  return getCabiStationStatus().then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json"
    );
    expect(data).toEqual(cabiStationStatus.data.stations);
  });
});

test("Merges Capital Bikeshare station GeoJSON and live station status", () => {
  expect(
    mergeCabiStationJSON(cabiStationGeoJSON, cabiStationStatus.data.stations)
  ).toEqual(mergedCabiGeoJSON);
});
