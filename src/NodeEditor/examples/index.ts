import styleClusters from './styleClusters';
import jsonNode from './jsonNode';
import lineString from './lineString';
import lineStringWithArrows from './lineString/withArrows';
import geojsonPolygon from './geojsonPolygon';
import mapProjection from './mapProjection';

const examples = {
  simple: jsonNode,
  'Add a line to a map using a GeoJSON source': lineString,
  'Showing Direction Arrow on Line in Mapboxgl': lineStringWithArrows, // https://stackoverflow.com/questions/53257291/how-to-make-a-custom-line-layer-in-mapbox-gl
  'Add a polygon to a map using a GeoJSON source': geojsonPolygon,
  'Display a web map using an alternate projection': mapProjection,
  'Create and style clusters': styleClusters,
};

export default examples;
