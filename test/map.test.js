import { expect, test } from "@jest/globals";
import { addSources } from "../map";
import { cabiStationGeoJSON } from "./fixtures";

test("addSources promise resolves with arguments", () => {
  return addSources(cabiStationGeoJSON).then((data) => {
    expect(data).toBe(cabiStationGeoJSON);
  });
});
