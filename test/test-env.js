import { jest } from "@jest/globals";

global.mapboxgl = {
  accessToken:
    "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImNra2JmZHplYzBjcXgyd291M3l2aWIxODAifQ.uCZpVDpR-z3BEUV0R7S1NA",
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
  })),
  Popup: jest.fn(() => ({
    setHTML: jest.fn(),
  })),
};
