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

  export type CabiColorStopExpression = [
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
    string[],
    number,
    string[],
    number,
    string[]
  ];

  export interface Service {
    default: boolean;
    service: string;
    menuName: string;
    url: string;
    vehicleType: string;
    sourceId: string;
    pointLayerId: string;
    pointCircleColor: string;
    polygonLayerId: string;
    polygonFillOutlineColor: string;
    polygonFillColor: any;
    featureStateName: string;
    featureStateDisabledName: string;
  }

  export interface CabiService {
    service: string;
    vehicleType: string;
    sourceId: string;
    pointLayerId: string;
    pointCircleColor: string;
    availability: CabiSubService;
    capacity: CabiSubService;
  }

  export interface CabiSubService {
    default: boolean;
    service: string;
    menuName: string;
    vehicleType: string;
    polygonLayerId: string;
    pointLayerId: string;
    polygonFillOutlineColor: string;
    polygonFillColor: any;
    featureStateName: string;
  }

  export type Services = [Service, CabiSubService, CabiSubService, Service];
}
