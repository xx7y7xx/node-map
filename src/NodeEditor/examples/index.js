import styleClusters from './styleClusters';
import jsonNode from './jsonNode';
import lineString from './lineString';
import geojsonPolygon from './geojsonPolygon';
import mapProjection from './mapProjection';

const examples = {
  simple: jsonNode,
  'Add a line to a map using a GeoJSON source': lineString,
  'Add a polygon to a map using a GeoJSON source': { component: geojsonPolygon, link: 'https://docs.mapbox.com/mapbox-gl-js/example/geojson-polygon/' },
  'Display a web map using an alternate projection': mapProjection,
  'Create and style clusters': styleClusters,
};

export default examples;
