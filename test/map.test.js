import { expect, test, jest, afterEach } from "@jest/globals";
import { fetchBikeData } from "../map";
import { cabiStationInformationMock, limeApi } from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
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

  expect(fetch).toHaveBeenCalledTimes(4);
  expect(fetch).toHaveBeenCalledWith(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
  );
  expect(fetch).toHaveBeenCalledWith(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json"
  );
  expect(fetch).toHaveBeenCalledWith(
    "https://vercel-cors-proxy.vercel.app/api/proxy?service=lime"
  );
  expect(fetch).toHaveBeenCalledWith(
    "https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status"
  );
});
