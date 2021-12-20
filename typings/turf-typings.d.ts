import {
  Position,
  BBox,
  Feature,
  Polygon,
  Point,
  MultiPoint,
  MultiPolygon,
  FeatureCollection,
} from "geojson";
import { FeatureCollectionWithProperties } from "../src/map";

export as namespace turf;

export declare type Properties = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;
} | null;

export declare type Id = string | number;

export declare function polygon<P = Properties>(
  coordinates: Position[][],
  properties?: P,
  options?: {
    bbox?: BBox;
    id?: Id;
  }
): Feature<Polygon, P>;

export declare function pointsWithinPolygon<
  F extends Point | MultiPoint,
  G extends Polygon | MultiPolygon,
  P = Properties
>(
  points:
    | Feature<F, P>
    | FeatureCollection<F, P>
    | FeatureCollectionWithProperties,
  polygons: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<F, P>;

export default turf;
