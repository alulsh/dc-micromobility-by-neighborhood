const spin = {
    default: false,
    service: "Spin",
    menuName: "Spin scooters",
    url: "https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status",
    vehicleType: "scooters",
    sourceId: "spin-scooters-source",
    pointLayerId: "spin-scooters-points",
    pointCircleColor: "#EE4B2B",
    polygonLayerId: "total-spin-scooters",
    polygonFillOutlineColor: "#FFFFFF",
    polygonFillColor: [
        "interpolate",
        ["linear"],
        ["feature-state", "totalSpinScooters"],
        0,
        ["to-color", "#ffd7cb"],
        25,
        ["to-color", "#ffc3b0"],
        50,
        ["to-color", "#ffaf97"],
        75,
        ["to-color", "#ff9b7e"],
        100,
        ["to-color", "#ff8565"],
        150,
        ["to-color", "#ff6f4e"],
        200,
        ["to-color", "#ff6b4a"],
    ],
    featureStateName: "totalSpinScooters",
    featureStateDisabledName: "totalDisabledSpinScooters",
};
const capitalBikeshare = {
    service: "Capital Bikeshare",
    vehicleType: "bikes",
    sourceId: "cabi-stations-source",
    pointLayerId: "cabi-stations-points",
    pointCircleColor: "#ee3122",
    availability: {
        default: false,
        service: "Capital Bikeshare",
        menuName: "Capital Bikeshare availability",
        vehicleType: "bikes",
        pointLayerId: "cabi-stations-points",
        polygonLayerId: "cabi-bikes-availability",
        polygonFillOutlineColor: "#FFF",
        polygonFillColor: [
            "interpolate",
            ["linear"],
            ["feature-state", "totalBikesAvailable"],
            0,
            ["to-color", "#ffd200"],
            50,
            ["to-color", "#ffba00"],
            100,
            ["to-color", "#ffa200"],
            200,
            ["to-color", "#ff8900"],
            300,
            ["to-color", "#fc6f00"],
            400,
            ["to-color", "#f65315"],
            500,
            ["to-color", "#ee3122"],
        ],
        featureStateName: "totalBikeAvailability",
    },
    capacity: {
        default: false,
        service: "Capital Bikeshare",
        menuName: "Capital Bikeshare capacity",
        vehicleType: "bikes",
        pointLayerId: "cabi-stations-points",
        polygonLayerId: "cabi-bikes-capacity",
        polygonFillOutlineColor: "#FFF",
        polygonFillColor: [
            "interpolate",
            ["linear"],
            ["feature-state", "totalBikeCapacity"],
            0,
            ["to-color", "#ffd200"],
            50,
            ["to-color", "#ffba00"],
            100,
            ["to-color", "#ffa200"],
            200,
            ["to-color", "#ff8900"],
            300,
            ["to-color", "#fc6f00"],
            400,
            ["to-color", "#f65315"],
            500,
            ["to-color", "#ee3122"],
        ],
        featureStateName: "totalBikeCapacity",
    },
};
const helbiz = {
    default: true,
    url: "https://api.helbiz.com/admin/reporting/washington/gbfs/free_bike_status.json",
    service: "Helbiz",
    menuName: "Helbiz scooters",
    vehicleType: "scooters",
    sourceId: "helbiz-scooters-source",
    pointLayerId: "helbiz-scooters-points",
    pointCircleColor: "#004CBF",
    polygonLayerId: "total-helbiz-scooters",
    polygonFillOutlineColor: "#FFFFFF",
    polygonFillColor: [
        "interpolate",
        ["linear"],
        ["feature-state", "totalHelbizScooters"],
        0,
        ["to-color", "#e3ffff"],
        10,
        ["to-color", "#cbf8fb"],
        20,
        ["to-color", "#b1f1f9"],
        30,
        ["to-color", "#96eaf9"],
        40,
        ["to-color", "#78e2fa"],
        50,
        ["to-color", "#53dafc"],
        60,
        ["to-color", "#02d2ff"],
    ],
    featureStateName: "totalHelbizScooters",
    featureStateDisabledName: "totalDisabledHelbizScooters",
};
const services = [
    helbiz,
    spin,
    capitalBikeshare.availability,
    capitalBikeshare.capacity,
];
export { services, spin, capitalBikeshare, helbiz };
