import { test } from "@jest/globals";
import convertToGeoJSON from "../map";

test("Converts Capital Bikeshare JSON to valid GeoJSON", () => {
  convertToGeoJSON({});
});
