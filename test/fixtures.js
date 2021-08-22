const cabiStationInformationMock = {
  data: {
    stations: [
      {
        rental_uris: {
          ios: "https://dc.lft.to/lastmile_qr_scan",
          android: "https://dc.lft.to/lastmile_qr_scan",
        },
        station_id: "88",
        short_name: "31609",
        electric_bike_surcharge_waiver: false,
        external_id: "0824a68f-1f3f-11e7-bf6b-3863bb334450",
        lat: 38.878693599396954,
        legacy_id: "88",
        eightd_has_key_dispenser: false,
        rental_methods: ["KEY", "CREDITCARD"],
        capacity: 19,
        name: "Maine Ave & 7th St SW",
        has_kiosk: true,
        eightd_station_services: [],
        lon: -77.02305436134338,
        region_id: "42",
        station_type: "classic",
      },
      {
        rental_uris: {
          ios: "https://dc.lft.to/lastmile_qr_scan",
          android: "https://dc.lft.to/lastmile_qr_scan",
        },
        station_id: "207",
        short_name: "31265",
        electric_bike_surcharge_waiver: false,
        external_id: "08254442-1f3f-11e7-bf6b-3863bb334450",
        lat: 38.90093,
        legacy_id: "207",
        eightd_has_key_dispenser: false,
        rental_methods: ["KEY", "CREDITCARD"],
        capacity: 19,
        name: "5th St & Massachusetts Ave NW",
        has_kiosk: true,
        eightd_station_services: [],
        lon: -77.018677,
        region_id: "42",
        station_type: "classic",
      },
      {
        station_type: "classic",
        electric_bike_surcharge_waiver: false,
        rental_uris: {
          ios: "https://dc.lft.to/lastmile_qr_scan",
          android: "https://dc.lft.to/lastmile_qr_scan",
        },
        eightd_station_services: [],
        lat: 38.856425,
        capacity: 17,
        lon: -77.049232,
        eightd_has_key_dispenser: false,
        has_kiosk: true,
        legacy_id: "3",
        region_id: "41",
        short_name: "31002",
        external_id: "08246c35-1f3f-11e7-bf6b-3863bb334450",
        station_id: "3",
        rental_methods: ["CREDITCARD", "KEY"],
        name: "Crystal Dr & 20th St S",
      },
    ],
  },
  last_updated: 1619971260,
  ttl: 5,
};

const cabiStationGeoJSON = {
  type: "FeatureCollection",
  service: "Capital Bikeshare",
  features: [
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.02305436134338, 38.878693599396954],
        type: "Point",
      },
      properties: {
        capacity: 19,
        name: "Maine Ave & 7th St SW",
        regionId: "42",
        stationId: "88",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.018677, 38.90093],
        type: "Point",
      },
      properties: {
        capacity: 19,
        name: "5th St & Massachusetts Ave NW",
        regionId: "42",
        stationId: "207",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.049232, 38.856425],
        type: "Point",
      },
      properties: {
        capacity: 17,
        name: "Crystal Dr & 20th St S",
        regionId: "41",
        stationId: "3",
      },
    },
  ],
};

const cabiStationStatus = {
  data: {
    stations: [
      {
        num_ebikes_available: 0,
        num_docks_disabled: 0,
        is_renting: 1,
        last_reported: 1621734453,
        is_returning: 1,
        is_installed: 1,
        station_status: "active",
        num_bikes_available: 17,
        station_id: "3",
        eightd_has_available_keys: false,
        legacy_id: "3",
        num_bikes_disabled: 0,
        num_docks_available: 0,
      },
      {
        num_ebikes_available: 1,
        num_docks_disabled: 0,
        is_renting: 1,
        last_reported: 1621788119,
        is_returning: 1,
        is_installed: 1,
        station_status: "active",
        num_bikes_available: 6,
        station_id: "88",
        eightd_has_available_keys: false,
        legacy_id: "88",
        num_bikes_disabled: 0,
        num_docks_available: 13,
      },
      {
        num_ebikes_available: 0,
        num_docks_disabled: 0,
        is_renting: 1,
        last_reported: 1621788326,
        is_returning: 1,
        is_installed: 1,
        station_status: "active",
        num_bikes_available: 15,
        station_id: "207",
        eightd_has_available_keys: false,
        legacy_id: "207",
        num_bikes_disabled: 1,
        num_docks_available: 3,
      },
    ],
  },
  last_updated: 1621788410,
  ttl: 5,
};

const mergedCabiGeoJSON = {
  type: "FeatureCollection",
  service: "Capital Bikeshare",
  features: [
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.02305436134338, 38.878693599396954],
        type: "Point",
      },
      properties: {
        capacity: 19,
        name: "Maine Ave & 7th St SW",
        regionId: "42",
        stationId: "88",
        isRenting: 1,
        ebikesAvailable: 1,
        docksAvailable: 13,
        docksDisabled: 0,
        bikesDisabled: 0,
        bikesAvailable: 6,
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.018677, 38.90093],
        type: "Point",
      },
      properties: {
        capacity: 19,
        name: "5th St & Massachusetts Ave NW",
        regionId: "42",
        stationId: "207",
        isRenting: 1,
        ebikesAvailable: 0,
        docksAvailable: 3,
        docksDisabled: 0,
        bikesDisabled: 1,
        bikesAvailable: 15,
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.049232, 38.856425],
        type: "Point",
      },
      properties: {
        capacity: 17,
        name: "Crystal Dr & 20th St S",
        regionId: "41",
        stationId: "3",
        isRenting: 1,
        ebikesAvailable: 0,
        docksAvailable: 0,
        docksDisabled: 0,
        bikesDisabled: 0,
        bikesAvailable: 17,
      },
    },
  ],
};

const limeApi = {
  last_updated: 1625497679,
  ttl: 0,
  version: "1.0",
  data: {
    bikes: [
      {
        bike_id: "70bdfc48-5a96-41b9-8ef7-4d040ad77e79",
        lat: "38.8934",
        lon: "-77.0201",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "scooter",
      },
      {
        bike_id: "82f6a131-eee5-4772-bd3f-17443da42879",
        lat: "38.962",
        lon: "-77.0273",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "bike",
      },
      {
        bike_id: "688aedbf-eee2-4f03-8b3c-eaf6a7d67a34",
        lat: "38.9743",
        lon: "-77.0556",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "moped",
      },
      {
        bike_id: "a91172ce-3d44-485a-aaf9-6ed142280d41",
        lat: "38.9079",
        lon: "-77.0836",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "moped",
      },
      {
        bike_id: "f7e273fc-3d43-48a9-8e27-5eb250bf47f5",
        lat: "38.8948",
        lon: "-76.9136",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "scooter",
      },
      {
        bike_id: "c7350ed4-a4a9-40de-9e54-eea20751f6b7",
        lat: "38.898",
        lon: "-76.9173",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "bike",
      },
      {
        bike_id: "2c8b70c9-1cb8-49ca-9643-8fb476aa64eb",
        lat: "38.8988",
        lon: "-76.9205",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "bike",
      },
      {
        bike_id: "30e16768-1601-46d3-8c2a-7e4920ae5cc9",
        lat: "38.8984",
        lon: "-76.9207",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "moped",
      },
      {
        bike_id: "5d4af2de-a1ad-479e-a99a-6fae6b618ce9",
        lat: "38.8847",
        lon: "-76.9208",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "scooter",
      },
      {
        bike_id: "5171d684-43fc-4847-8290-e16e7ea700c1",
        lat: "38.8836",
        lon: "-76.9217",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "moped",
      },
      {
        bike_id: "b32005a3-f5ac-4271-9081-d80c56e28164",
        lat: "38.8934",
        lon: "-76.9221",
        is_reserved: 0,
        is_disabled: 0,
        vehicle_type: "bike",
      },
    ],
  },
};

const limeBikesOnly = [
  {
    bike_id: "82f6a131-eee5-4772-bd3f-17443da42879",
    lat: "38.962",
    lon: "-77.0273",
    is_reserved: 0,
    is_disabled: 0,
    vehicle_type: "bike",
  },
  {
    bike_id: "c7350ed4-a4a9-40de-9e54-eea20751f6b7",
    lat: "38.898",
    lon: "-76.9173",
    is_reserved: 0,
    is_disabled: 0,
    vehicle_type: "bike",
  },
  {
    bike_id: "2c8b70c9-1cb8-49ca-9643-8fb476aa64eb",
    lat: "38.8988",
    lon: "-76.9205",
    is_reserved: 0,
    is_disabled: 0,
    vehicle_type: "bike",
  },
  {
    bike_id: "b32005a3-f5ac-4271-9081-d80c56e28164",
    lat: "38.8934",
    lon: "-76.9221",
    is_reserved: 0,
    is_disabled: 0,
    vehicle_type: "bike",
  },
];

const limeBikesGeoJSON = {
  type: "FeatureCollection",
  featureStateName: "totalLimeBikes",
  features: [
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.0273, 38.962],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "bike",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-76.9173, 38.898],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "bike",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-76.9205, 38.8988],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "bike",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-76.9221, 38.8934],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "bike",
      },
    },
  ],
};

const spinApi = {
  last_updated: 1628353875,
  ttl: 30,
  data: {
    bikes: [
      {
        bike_id: "e6c9f8cd-9d29-4862-89b9-545f82f46ef3",
        lat: 38.9216,
        lon: -77.04226,
        vehicle_type: "scooter",
        is_reserved: 0,
        is_disabled: 0,
      },
      {
        bike_id: "ae043de6-64c8-4a20-a88f-75ca12724197",
        lat: 38.86727,
        lon: -77.0135,
        vehicle_type: "scooter",
        is_reserved: 0,
        is_disabled: 0,
      },
      {
        bike_id: "a0c9ca9d-3fda-40c4-8d8f-b9e4c7f62238",
        lat: 38.92864,
        lon: -77.03502,
        vehicle_type: "scooter",
        is_reserved: 0,
        is_disabled: 0,
      },
      {
        bike_id: "795d27ed-c516-420c-a0fb-775a5486bb85",
        lat: 38.90836,
        lon: -77.04302,
        vehicle_type: "scooter",
        is_reserved: 0,
        is_disabled: 0,
      },
      {
        bike_id: "21d4b9a4-9872-4112-b650-0ae03ee41d4d",
        lat: 38.91574,
        lon: -76.98388,
        vehicle_type: "scooter",
        is_reserved: 0,
        is_disabled: 0,
      },
    ],
  },
};

const spinScootersGeoJSON = {
  type: "FeatureCollection",
  featureStateName: "totalSpinScooters",
  features: [
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.04226, 38.9216],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "scooter",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.0135, 38.86727],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "scooter",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.03502, 38.92864],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "scooter",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-77.04302, 38.90836],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "scooter",
      },
    },
    {
      type: "Feature",
      geometry: {
        coordinates: [-76.98388, 38.91574],
        type: "Point",
      },
      properties: {
        isReserved: 0,
        isDisabled: 0,
        vehicleType: "scooter",
      },
    },
  ],
};

export {
  cabiStationInformationMock,
  cabiStationGeoJSON,
  cabiStationStatus,
  mergedCabiGeoJSON,
  limeApi,
  limeBikesOnly,
  limeBikesGeoJSON,
  spinApi,
  spinScootersGeoJSON,
};
