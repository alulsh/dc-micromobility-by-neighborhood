import { expect, test, jest, afterEach } from "@jest/globals";
import { getVehicles, convertToGeoJSON, filterVehicles } from "../vehicles";
import { spin, helbiz } from "../constants";
import {
  spinApi,
  spinScootersGeoJSON,
  helbizApi,
  helbizScootersOnly,
  helbizScootersGeoJSON,
} from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("Fetch Spin API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(spinApi),
    })
  );

  return getVehicles(spin).then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status"
    );
    expect(data).toEqual(spinScootersGeoJSON);
  });
});

test("Converts Spin scooter data to GeoJSON", () => {
  expect(convertToGeoJSON(spin, spinApi.data.bikes)).toEqual(
    spinScootersGeoJSON
  );
});

test("Fetch Helbiz API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(helbizApi),
    })
  );

  return getVehicles(helbiz).then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.helbiz.com/admin/reporting/washington/gbfs/free_bike_status.json"
    );
    expect(data).toEqual(helbizScootersGeoJSON);
  });
});

test("Filters out mopeds from Helbiz API response", () => {
  expect(filterVehicles(helbizApi.data.bikes, "scooter")).toEqual(
    helbizScootersOnly
  );
});

test("Converts filtered Helbiz scooters data to GeoJSON", () => {
  expect(convertToGeoJSON(helbiz, helbizScootersOnly)).toEqual(
    helbizScootersGeoJSON
  );
});
