import { expect, test, jest, afterEach } from "@jest/globals";
import { getLimeBikes } from "../lime";
import { limeApi } from "./fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

test("Requests Lime API from CORS proxy", () => {
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
    expect(data).toEqual(limeApi.data.bikes);
  });
});
