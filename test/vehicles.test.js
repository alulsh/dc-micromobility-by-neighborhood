import { expect, test, jest, afterEach } from "@jest/globals";
import { getVehicles, convertToGeoJSON, filterVehicles } from "../vehicles";
import { spin, limeBikes, helbiz } from "../constants";
import {
  spinApi,
  spinScootersGeoJSON,
  limeApi,
  limeBikesOnly,
  limeBikesGeoJSON,
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

test("Fetch Lime API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(limeApi),
    })
  );

  return getVehicles(limeBikes).then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://data.lime.bike/api/partners/v1/gbfs/washington_dc/free_bike_status.json"
    );
    expect(data).toEqual(limeBikesGeoJSON);
  });
});

test("Filters out scooter and mopeds from Lime API response", () => {
  expect(filterVehicles(limeApi.data.bikes, "bike")).toEqual(limeBikesOnly);
});

test("Converts filtered Lime bike data to GeoJSON", () => {
  expect(convertToGeoJSON(limeBikes, limeBikesOnly)).toEqual(limeBikesGeoJSON);
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
