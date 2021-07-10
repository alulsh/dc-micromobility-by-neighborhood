import { expect, test, jest, afterEach } from "@jest/globals";
import { addCabiSource, fetchBikeData } from "../map";
import {
  cabiStationGeoJSON,
  cabiStationInformationMock,
  limeApi,
} from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("addSources promise resolves with arguments", () => {
  return addCabiSource(cabiStationGeoJSON).then((data) => {
    expect(data).toBe(cabiStationGeoJSON);
  });
});

test("fetchBikeData makes expected API calls", () => {
  // https://stackoverflow.com/a/65846089
  const fetchResponse = (value) =>
    Promise.resolve({
      json: () => Promise.resolve(value),
    });
  global.fetch = jest
    .fn()
    .mockReturnValueOnce(fetchResponse(cabiStationInformationMock))
    .mockReturnValueOnce(fetchResponse(cabiStationInformationMock))
    .mockReturnValueOnce(fetchResponse(limeApi));

  fetchBikeData();

  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch).toHaveBeenCalledWith(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
  );
  expect(fetch).toHaveBeenCalledWith(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json"
  );
  expect(fetch).toHaveBeenCalledWith(
    "https://vercel-test-alulsh.vercel.app/api/proxy?service=lime"
  );
});
