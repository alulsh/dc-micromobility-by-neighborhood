const spin = {
  default: false,
  service: "Spin",
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

const limeBikes = {
  default: true,
  service: "Lime",
  vehicleType: "Bikes",
  sourceId: "lime-bikes-source",
  pointLayerId: "lime-bikes-points",
  pointCircleColor: "#50C878",
  polygonLayerId: "total-lime-bikes",
  polygonFillOutlineColor: "#DCDCDC",
  polygonFillColor: [
    "interpolate",
    ["linear"],
    ["feature-state", "totalLimeBikes"],
    0,
    ["to-color", "rgb(255, 255, 255)"],
    5,
    ["to-color", "rgb(244, 255, 212)"],
    10,
    ["to-color", "rgb(233, 255, 170)"],
    15,
    ["to-color", "rgb(223, 255, 127)"],
    20,
    ["to-color", "rgb(212, 255, 85)"],
    25,
    ["to-color", "rgb(201, 255, 42)"],
    30,
    ["to-color", "rgb(191, 255, 0)"],
  ],
  featureStateName: "totalLimeBikes",
};

const bird = {
  default: false,
  service: "Bird",
  vehicleType: "Scooters",
  sourceId: "bird-scooters-source",
  pointLayerId: "bird-scooters-points",
  pointCircleColor: "#EE4B2B",
  polygonLayerId: "total-bird-scooters",
  polygonFillOutlineColor: "#DCDCDC",
  polygonFillColor: [
    "interpolate",
    ["linear"],
    ["feature-state", "totalBirdScooters"],
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
  featureStateName: "totalBirdScooters",
};

const services = [spin, capitalBikeshare, limeBikes, bird];

export { services, spin, capitalBikeshare, limeBikes, bird };
