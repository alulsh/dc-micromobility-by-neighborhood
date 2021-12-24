import type { Feature, FeatureCollection } from "geojson";
import type { FeatureCollectionWithProperties } from "./map";
import { capitalBikeshare } from "./constants.js";

function convertToGeoJSON(bikeshareJSON: []) {
  const stations: Feature[] = [];

  bikeshareJSON.forEach((station: Record<string, string | number>) => {
    const feature: Feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [<number>station.lon, <number>station.lat],
      },
      properties: {
        name: station.name,
        regionId: station.region_id,
        capacity: station.capacity,
        stationId: station.station_id,
      },
    };
    stations.push(feature);
  });

  return {
    type: "FeatureCollection",
    properties: capitalBikeshare,
    features: stations,
  } as FeatureCollectionWithProperties;
}

async function getCabiStationInformation() {
  const response = await fetch(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
  );
  const json = await response.json();
  const stationGeoJSON = convertToGeoJSON(json.data.stations);

  return stationGeoJSON;
}

async function getCabiStationStatus() {
  const response = await fetch(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json"
  );
  const json = await response.json();

  return json.data.stations;
}

function mergeCabiStationJSON(
  stationGeoJSON: FeatureCollection,
  stationStatus: Record<string, string | number>[]
) {
  const mergedFeatures: any[] = stationGeoJSON.features.map((feature) => ({
    ...feature,
    ...stationStatus.find(
      (station) => feature?.properties?.stationId === station.station_id
    ),
  }));

  const cleanFeatures = mergedFeatures.map((feature) => {
    const cleanFeature = feature;
    delete cleanFeature.eightd_has_available_keys;
    delete cleanFeature.legacy_id;
    delete cleanFeature.station_status;
    delete cleanFeature.is_returning;
    delete cleanFeature.is_installed;
    delete cleanFeature.last_reported;
    delete cleanFeature.station_id;
    cleanFeature.properties.isRenting = feature.is_renting;
    delete cleanFeature.is_renting;
    cleanFeature.properties.ebikesAvailable = feature.num_ebikes_available;
    delete cleanFeature.num_ebikes_available;
    cleanFeature.properties.docksAvailable = feature.num_docks_available;
    delete cleanFeature.num_docks_available;
    cleanFeature.properties.bikesAvailable = feature.num_bikes_available;
    delete cleanFeature.num_bikes_available;
    cleanFeature.properties.bikesDisabled = feature.num_bikes_disabled;
    delete cleanFeature.num_bikes_disabled;
    cleanFeature.properties.docksDisabled = feature.num_docks_disabled;
    delete cleanFeature.num_docks_disabled;
    return cleanFeature;
  });

  return {
    type: "FeatureCollection",
    properties: capitalBikeshare,
    features: cleanFeatures,
  } as FeatureCollectionWithProperties;
}

export {
  convertToGeoJSON,
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
};
