declare module "services" {
  export type ColorStopExpression = [
    string,
    string[],
    string[],
    number,
    string[],
    number,
    string[],
    number,
    string[],
    number,
    string[],
    number,
    string[],
    number,
    string[],
    number,
    string[]
  ];

  export interface Service {
    default: boolean;
    name: string;
    menuText: string;
    url: string;
    vehicleType: string;
    sourceId: string;
    pointLayerId: string;
    pointCircleColor: string;
    polygonLayerId: string;
    polygonFillOutlineColor: string;
    polygonFillColor: ColorStopExpression;
    featureStateName: string;
    featureStateDisabledName: string;
  }

  export interface CabiService {
    name: string;
    vehicleType: string;
    sourceId: string;
    pointLayerId: string;
    pointCircleColor: string;
    availability: CabiSubService;
    percentAvailable: CabiSubService;
    capacity: CabiSubService;
  }

  export interface CabiSubService {
    default: boolean;
    name: string;
    menuText: string;
    vehicleType: string;
    polygonLayerId: string;
    pointLayerId: string;
    polygonFillOutlineColor: string;
    polygonFillColor: ColorStopExpression;
    featureStateName: string;
  }

  export type Services = [Service, CabiSubService, CabiSubService, Service];
}
