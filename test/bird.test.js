import { expect, test, jest, afterEach } from "@jest/globals";
import { getBirdScooters, convertToGeoJSON } from "../bird";
import { birdApi, birdScootersGeoJSON } from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("Fetch Spin API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(birdApi),
    })
  );

  return getBirdScooters().then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://gbfs.bird.co/dc");
    expect(data).toEqual(birdScootersGeoJSON);
  });
});

test("Converts Spin scooter data to GeoJSON", () => {
  expect(convertToGeoJSON(birdApi.data.bikes)).toEqual(birdScootersGeoJSON);
});
