import { expect, test, jest, afterEach } from "@jest/globals";
import { getVehicles, convertToGeoJSON, filterVehicles } from "../vehicles";
import { spin, bird, limeBikes } from "../constants";
import {
  spinApi,
  spinScootersGeoJSON,
  birdApi,
  birdScootersGeoJSON,
  limeApi,
  limeBikesOnly,
  limeBikesGeoJSON,
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

test("Fetch Bird API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(birdApi),
    })
  );

  return getVehicles(bird).then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://gbfs.bird.co/dc");
    expect(data).toEqual(birdScootersGeoJSON);
  });
});

test("Converts Bird scooter data to GeoJSON", () => {
  expect(convertToGeoJSON(bird, birdApi.data.bikes)).toEqual(
    birdScootersGeoJSON
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
      "https://vercel-cors-proxy.vercel.app/api/proxy?service=lime"
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
