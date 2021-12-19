import { expect, test, jest, afterEach } from "@jest/globals";
import type { Service } from "services";
import { getVehicles, convertToGeoJSON, filterVehicles } from "../src/vehicles";
import { spin, helbiz } from "../src/constants";
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

// https://stackoverflow.com/questions/44180693/jest-mock-and-typescript/60376517#comment78899968_44180693
// eslint-disable-next-line @typescript-eslint/ban-types
declare let global: { fetch: {} };

test("Fetch Spin API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(spinApi),
    })
  );

  return getVehicles(<Service>spin).then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status"
    );
    expect(data).toEqual(spinScootersGeoJSON);
  });
});

test("Converts Spin scooter data to GeoJSON", () => {
  expect(convertToGeoJSON(<Service>spin, spinApi.data.bikes)).toEqual(
    spinScootersGeoJSON
  );
});

test("Fetch Helbiz API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(helbizApi),
    })
  );

  return getVehicles(<Service>helbiz).then((data) => {
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
  expect(convertToGeoJSON(<Service>helbiz, helbizScootersOnly)).toEqual(
    helbizScootersGeoJSON
  );
});
