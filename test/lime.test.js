import { expect, test, jest, afterEach } from "@jest/globals";
import { getLimeBikes, filterLimeBikes } from "../lime";
import { limeApi, limeBikesOnly } from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("Requests then filters Lime API data from CORS proxy", () => {
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
    expect(data).toEqual(limeBikesOnly);
  });
});

test("Filters out scooter and mopeds from Lime API response", () => {
  expect(filterLimeBikes(limeApi.data.bikes)).toEqual(limeBikesOnly);
});
