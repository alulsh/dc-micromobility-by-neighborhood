function BikeShareStation(lon, lat, name, regionId, capacity) {
  this.type = "Feature";
  this.geometry = {};
  this.properties = {};
  this.geometry.type = "Point";
  this.geometry.coordinates = [lon, lat];
  this.properties.name = name;
  this.properties.regionId = regionId;
  this.properties.capacity = capacity;
}

function FeatureCollection(features) {
  this.type = "FeatureCollection";
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
      station.capacity
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

export { convertToGeoJSON, getCabiStationInformation };
