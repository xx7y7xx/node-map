import FillLayerComponent, { INPUT_KEY as MAP_FILL_LAYER_INPUT_KEY } from 'NodeEditor/FillLayerComponent';
import { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import GeoJSONSourceComponent, { INPUT_KEY as MAP_GEOJSON_INPUT_KEY, OUTPUT_KEY as MAP_GEOJSON_OUTPUT_KEY, CONTROL_KEY_SOURCE_ID } from '../../GeoJSONSourceComponent';
import LineLayerComponent, { INPUT_KEY as MAP_LINE_LAYER_INPUT_KEY } from '../../LineLayerComponent';
import geojson from './data.json';

export default async function Example() {
  const { editor, allComponents: c } = window.___nodeMap;

  const {
    mapComponent, jsonComponent,
  } = c;
  const m = editor.components;

  const mapNode = await mapComponent.createNode();
  const jsonNode = await jsonComponent.createNode({ [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson } });
  const geojsonSourceNode = await m.get(GeoJSONSourceComponent.key).createNode({ [CONTROL_KEY_SOURCE_ID]: 'maine' });

  console.debug('Example components get', editor.components.get(LineLayerComponent.key));
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
