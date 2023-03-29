import jsonNode from './jsonNode';
import lineString from './lineString';
import geojsonPolygon from './geojsonPolygon';
import mapProjection from './mapProjection';

const examples = {
  simple: jsonNode,
  'Add a line to a map using a GeoJSON source': lineString,
  'Add a polygon to a map using a GeoJSON source': geojsonPolygon,
  'Display a web map using an alternate projection': mapProjection,
};

export default examples;
