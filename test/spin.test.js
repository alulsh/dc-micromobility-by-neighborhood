import { expect, test, jest, afterEach } from "@jest/globals";
import { getSpinScooters, convertToGeoJSON } from "../spin";
import { spinApi, spinScootersGeoJSON } from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("Fetch Spin API", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(spinApi),
    })
  );

  return getSpinScooters().then((data) => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status"
    );
    expect(data).toEqual(spinScootersGeoJSON);
  });
});

test("Converts Spin scooter data to GeoJSON", () => {
  expect(convertToGeoJSON(spinApi.data.bikes)).toEqual(spinScootersGeoJSON);
});
