import { expect, test, jest, afterEach } from "@jest/globals";
import { addSources, fetchBikeData } from "../map";
import { cabiStationGeoJSON, cabiStationInformationMock } from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("addSources promise resolves with arguments", () => {
  return addSources(cabiStationGeoJSON).then((data) => {
    expect(data).toBe(cabiStationGeoJSON);
  });
});

test("fetchBikeData makes expected API calls", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(cabiStationInformationMock),
    })
  );

  fetchBikeData();

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenCalledWith(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
  );
  expect(fetch).toHaveBeenCalledWith(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json"
  );
});
