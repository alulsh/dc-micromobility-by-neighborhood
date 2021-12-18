/* eslint-disable import/extensions */
import { capitalBikeshare } from "./src/constants";

function convertToGeoJSON(bikeshareJSON) {
  const newStationArray = [];
  const stationArray = bikeshareJSON;

  stationArray.forEach((station) => {
    const newStation = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [station.lon, station.lat],
      },
      properties: {
        name: station.name,
        regionId: station.region_id,
        capacity: station.capacity,
        stationId: station.station_id,
      },
    };
    newStationArray.push(newStation);
  });

  return {
    type: "FeatureCollection",
    properties: capitalBikeshare,
    features: newStationArray,
  };
}

async function getCabiStationInformation() {
  const response = await fetch(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
  );
  const jsonData = await response.json();
  const stationGeoJSON = convertToGeoJSON(jsonData.data.stations);

  return stationGeoJSON;
}

async function getCabiStationStatus() {
  const response = await fetch(
    "https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json"
  );
  const jsonData = await response.json();

  return jsonData.data.stations;
}

function mergeCabiStationJSON(stationGeoJSON, stationStatus) {
  const mergedArray = stationGeoJSON.features.map((feature) => ({
    ...feature,
    ...stationStatus.find(
      (station) => feature.properties.stationId === station.station_id
    ),
  }));

  const cleanedArray = mergedArray.map((item) => {
    const cleanedItem = item;
    delete cleanedItem.eightd_has_available_keys;
    delete cleanedItem.legacy_id;
    delete cleanedItem.station_status;
    delete cleanedItem.is_returning;
    delete cleanedItem.is_installed;
    delete cleanedItem.last_reported;
    delete cleanedItem.station_id;
    cleanedItem.properties.isRenting = item.is_renting;
    delete cleanedItem.is_renting;
    cleanedItem.properties.ebikesAvailable = item.num_ebikes_available;
    delete cleanedItem.num_ebikes_available;
    cleanedItem.properties.docksAvailable = item.num_docks_available;
    delete cleanedItem.num_docks_available;
    cleanedItem.properties.bikesAvailable = item.num_bikes_available;
    delete cleanedItem.num_bikes_available;
    cleanedItem.properties.bikesDisabled = item.num_bikes_disabled;
    delete cleanedItem.num_bikes_disabled;
    cleanedItem.properties.docksDisabled = item.num_docks_disabled;
    delete cleanedItem.num_docks_disabled;
    return cleanedItem;
  });

  return {
    type: "FeatureCollection",
    properties: capitalBikeshare,
    features: cleanedArray,
  };
}

export {
  convertToGeoJSON,
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
};
