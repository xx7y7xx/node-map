import FillLayerComponent, { INPUT_KEY as MAP_FILL_LAYER_INPUT_KEY } from 'NodeEditor/FillLayerComponent';
import MapComponent, { CONTROL_KEY_LAT, CONTROL_KEY_LNG, CONTROL_KEY_ZOOM } from 'NodeEditor/MapComponent';
import JsonComponent, { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import GeoJSONSourceComponent, { INPUT_KEY as MAP_GEOJSON_INPUT_KEY, OUTPUT_KEY as MAP_GEOJSON_OUTPUT_KEY, CONTROL_KEY_SOURCE_ID } from '../../GeoJSONSourceComponent';
import LineLayerComponent, { INPUT_KEY as MAP_LINE_LAYER_INPUT_KEY } from '../../LineLayerComponent';
import geojson from './data.json';

export default async function Example() {
  const { editor } = window.___nodeMap;
  const m = editor.components;

  const mapNode = await m.get(MapComponent.key).createNode({
    [CONTROL_KEY_LNG]: -68.137343,
    [CONTROL_KEY_LAT]: 45.137451,
    [CONTROL_KEY_ZOOM]: 5,
  });
  const jsonNode = await m.get(JsonComponent.key).createNode({ [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson } });
  const geojsonSourceNode = await m.get(GeoJSONSourceComponent.key).createNode({ [CONTROL_KEY_SOURCE_ID]: 'maine' });

  console.debug('Example components get', editor.components, editor.components.get(LineLayerComponent.key));
  const lineLayerNode = await m.get(LineLayerComponent.key).createNode({ 'line-color': '#000', 'line-width': 3 });
  const fillLayerNode = await m.get(FillLayerComponent.key).createNode({ 'fill-color': '#0080ff' });

  jsonNode.position = [0, 250];
  geojsonSourceNode.position = [270, 250];
  lineLayerNode.position = [600, 50];
  fillLayerNode.position = [600, 350];

  editor.addNode(mapNode);
  editor.addNode(jsonNode);
  editor.addNode(geojsonSourceNode);
  editor.addNode(lineLayerNode);
  editor.addNode(fillLayerNode);

  editor.connect(
    jsonNode.outputs.get(OUTPUT_KEY),
    geojsonSourceNode.inputs.get(MAP_GEOJSON_INPUT_KEY),
  );
  editor.connect(
    geojsonSourceNode.outputs.get(MAP_GEOJSON_OUTPUT_KEY),
    lineLayerNode.inputs.get(MAP_LINE_LAYER_INPUT_KEY),
  );
  editor.connect(
    geojsonSourceNode.outputs.get(MAP_GEOJSON_OUTPUT_KEY),
    fillLayerNode.inputs.get(MAP_FILL_LAYER_INPUT_KEY),
  );

  editor.view.area.translate(100, 100);
}
