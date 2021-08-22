/* eslint-disable import/extensions */
import { capitalBikeshare } from "./constants.js";

function BikeShareStation(lon, lat, name, regionId, capacity, stationId) {
  this.type = "Feature";
  this.geometry = {};
  this.properties = {};
  this.geometry.type = "Point";
  this.geometry.coordinates = [lon, lat];
  this.properties.name = name;
  this.properties.regionId = regionId;
  this.properties.stationId = stationId;
  this.properties.capacity = capacity;
}

function FeatureCollection(features) {
  this.type = "FeatureCollection";
  this.properties = capitalBikeshare;
  this.features = features;
}

function convertToGeoJSON(bikeshareJSON) {
  const newStationArray = [];
  const stationArray = bikeshareJSON;

  stationArray.forEach((station) => {
    const newStation = new BikeShareStation(
      station.lon,
      station.lat,
      station.name,
      station.region_id,
      station.capacity,
      station.station_id
    );
    newStationArray.push(newStation);
  });
  return new FeatureCollection(newStationArray);
}

function getCabiStationInformation() {
  return new Promise((resolve) => {
    fetch("https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json")
      .then((response) => response.json())
      .then((jsonData) => {
        const stationGeoJSON = convertToGeoJSON(jsonData.data.stations);
        resolve(stationGeoJSON);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
}

function getCabiStationStatus() {
  return new Promise((resolve) => {
    fetch("https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json")
      .then((response) => response.json())
      .then((jsonData) => {
        resolve(jsonData.data.stations);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
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

  return new FeatureCollection(cleanedArray);
}

export {
  convertToGeoJSON,
  getCabiStationInformation,
  getCabiStationStatus,
  mergeCabiStationJSON,
};
