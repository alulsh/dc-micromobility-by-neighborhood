import { expect, test, jest, afterEach } from "@jest/globals";
import { getLimeBikes, filterLimeBikes, convertToGeoJSON } from "../lime";
import { limeApi, limeBikesOnly, limeBikesGeoJSON } from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("Returns filtered and processed GeoJSON from Lime API via CORS proxy", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(limeApi),
    })
  );

  return getLimeBikes().then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://vercel-test-alulsh.vercel.app/api/proxy?service=lime"
    );
    expect(data).toEqual(limeBikesGeoJSON);
  });
});

test("Filters out scooter and mopeds from Lime API response", () => {
  expect(filterLimeBikes(limeApi.data.bikes)).toEqual(limeBikesOnly);
});

test("Converts filtered Lime bike data to GeoJSON", () => {
  expect(convertToGeoJSON(limeBikesOnly)).toEqual(limeBikesGeoJSON);
});
