import jsonNode from './jsonNode';
import lineString from './lineString';
import geojsonPolygon from './geojsonPolygon';

const examples = {
  simple: jsonNode,
  lineString,
  'Add a polygon to a map using a GeoJSON source': geojsonPolygon,
};

export default examples;
