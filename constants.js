const spin = {
  default: true,
  service: "Spin",
  menuName: "Spin scooters",
  url: "https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status",
  vehicleType: "Scooters",
  sourceId: "spin-scooters-source",
  pointLayerId: "spin-scooters-points",
  pointCircleColor: "#EE4B2B",
  polygonLayerId: "total-spin-scooters",
  polygonFillOutlineColor: "#DCDCDC",
  polygonFillColor: [
    "interpolate",
    ["linear"],
    ["feature-state", "totalSpinScooters"],
    0,
    ["to-color", "rgb(255, 255, 255)"],
    25,
    ["to-color", "#ffa600"],
    50,
    ["to-color", "#ff970c"],
    75,
    ["to-color", "#ff8718"],
    100,
    ["to-color", "#ff7723"],
    125,
    ["to-color", "#ff662c"],
    150,
    ["to-color", "#ff5435"],
  ],
  featureStateName: "totalSpinScooters",
};

const capitalBikeshare = {
  service: "Capital Bikeshare",
  vehicleType: "Bikes",
  sourceId: "cabi-stations-source",
  pointLayerId: "cabi-stations-points",
  pointCircleColor: "#363636",
  availability: {
    default: false,
    menuName: "Capital Bikeshare availability",
    vehicleType: "Bikes",
    polygonLayerId: "cabi-bikes-availability",
    polygonFillOutlineColor: "#FFF",
    polygonFillColor: [
      "interpolate",
      ["linear"],
      ["feature-state", "totalBikesAvailable"],
      0,
      ["to-color", "#F2F12D"],
      10,
      ["to-color", "#EED322"],
      20,
      ["to-color", "#E6B71E"],
      50,
      ["to-color", "#DA9C20"],
      100,
      ["to-color", "#CA8323"],
      200,
      ["to-color", "#B86B25"],
      300,
      ["to-color", "#A25626"],
      400,
      ["to-color", "#8B4225"],
      500,
      ["to-color", "#723122"],
    ],
    featureStateName: "totalBikeAvailability",
  },
  capacity: {
    default: false,
    menuName: "Capital Bikeshare capacity",
    vehicleType: "Bikes",
    polygonLayerId: "cabi-bikes-capacity",
    polygonFillOutlineColor: "#FFF",
    polygonFillColor: [
      "interpolate",
      ["linear"],
      ["feature-state", "totalBikeCapacity"],
      0,
      ["to-color", "#F2F12D"],
      10,
      ["to-color", "#EED322"],
      20,
      ["to-color", "#E6B71E"],
      50,
      ["to-color", "#DA9C20"],
      100,
      ["to-color", "#CA8323"],
      200,
      ["to-color", "#B86B25"],
      300,
      ["to-color", "#A25626"],
      400,
      ["to-color", "#8B4225"],
      500,
      ["to-color", "#723122"],
    ],
    featureStateName: "totalBikeCapacity",
  },
};

const helbiz = {
  default: false,
  url: "https://api.helbiz.com/admin/reporting/washington/gbfs/free_bike_status.json",
  service: "Helbiz",
  menuName: "Helbiz scooters",
  vehicleType: "Scooters",
  sourceId: "helbiz-scooters-source",
  pointLayerId: "helbiz-scooters-points",
  pointCircleColor: "#000000",
  polygonLayerId: "total-helbiz-scooters",
  polygonFillOutlineColor: "#DCDCDC",
  polygonFillColor: [
    "interpolate",
    ["linear"],
    ["feature-state", "totalHelbizScooters"],
    0,
    ["to-color", "#fdfffd"],
    25,
    ["to-color", "#d6ffe1"],
    50,
    ["to-color", "#b1ffd3"],
    75,
    ["to-color", "#8dfdd2"],
    100,
    ["to-color", "#6af9de"],
    125,
    ["to-color", "#48f5f4"],
    150,
    ["to-color", "#27ccf0"],
  ],
  featureStateName: "totalHelbizScooters",
};

const services = [
  spin,
  capitalBikeshare.availability,
  capitalBikeshare.capacity,
  helbiz,
];

export { services, spin, capitalBikeshare, helbiz };
