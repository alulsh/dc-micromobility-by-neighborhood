import { expect, test, jest, afterEach } from "@jest/globals";
import { getScooters, convertToGeoJSON } from "../scooters";
import { spin, bird } from "../constants";
import {
  spinApi,
  spinScootersGeoJSON,
  birdApi,
  birdScootersGeoJSON,
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

  return getScooters(spin).then((data) => {
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

  return getScooters(bird).then((data) => {
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
