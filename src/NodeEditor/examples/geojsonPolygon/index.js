import Rete from 'rete';

import FillLayerComponent, { INPUT_KEY as MAP_FILL_LAYER_INPUT_KEY, CONTROL_KEY as FILL_LAYER_CONTROL_KEY } from 'NodeEditor/FillLayerComponent';
import { stringSocket } from 'NodeEditor/UploadCsvComponent';
import { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import { INPUT_KEY as MAP_GEOJSON_INPUT_KEY, OUTPUT_KEY as MAP_GEOJSON_OUTPUT_KEY, CONTROL_KEY_SOURCE_ID } from '../../MapGeoJsonComponent';
import LineLayerComponent, {
  INPUT_KEY as MAP_LINE_LAYER_INPUT_KEY, CONTROL_KEY as MAP_LINE_LAYER_CONTROL_KEY, CONTROL_KEY_LINE_WIDTH,
} from '../../LineLayerComponent';
import geojson from './data.json';

export default async function Example() {
  const { editor, allComponents: c } = window.___nodeMap;

  const {
    mapComponent, jsonComponent, mapGeoJsonComponent,
  } = c;

  const mapNode = await mapComponent.createNode();
  const jsonNode = await jsonComponent.createNode({ [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson } });
  const mapGeoJsonNode = await mapGeoJsonComponent.createNode({ [CONTROL_KEY_SOURCE_ID]: 'maine' });

  console.debug('Example components get', editor.components.get(LineLayerComponent.key));
  const m = editor.components;
  const lineLayerNode = await m.get(LineLayerComponent.key).createNode({ [MAP_LINE_LAYER_CONTROL_KEY]: '#ec1313', [CONTROL_KEY_LINE_WIDTH]: 3 });
  // const mapLayerNode = await c[LineLayerComponent.key].createNode({ [MAP_LINE_LAYER_CONTROL_KEY]: '#ec1313', [CONTROL_KEY_LINE_WIDTH]: 3 });
  const fillLayerNode = await m.get(FillLayerComponent.key).createNode({ [FILL_LAYER_CONTROL_KEY]: '#ec1313' });

  jsonNode.position = [0, 250];
  mapGeoJsonNode.position = [270, 250];
  lineLayerNode.position = [600, 50];
  fillLayerNode.position = [600, 350];

  const index = 0;
  const geojsonSourceOutputKey = `${MAP_GEOJSON_OUTPUT_KEY}${index}`;
  mapGeoJsonNode.addOutput(
    new Rete.Output(geojsonSourceOutputKey, geojsonSourceOutputKey, stringSocket),
  );

  editor.addNode(mapNode);
  editor.addNode(jsonNode);
  editor.addNode(mapGeoJsonNode);
  editor.addNode(lineLayerNode);
  editor.addNode(fillLayerNode);

  editor.connect(
    jsonNode.outputs.get(OUTPUT_KEY),
    mapGeoJsonNode.inputs.get(MAP_GEOJSON_INPUT_KEY),
  );
  editor.connect(
    mapGeoJsonNode.outputs.get(MAP_GEOJSON_OUTPUT_KEY),
    lineLayerNode.inputs.get(MAP_LINE_LAYER_INPUT_KEY),
  );
  editor.connect(
    mapGeoJsonNode.outputs.get(geojsonSourceOutputKey),
    fillLayerNode.inputs.get(MAP_FILL_LAYER_INPUT_KEY),
  );

  editor.view.area.translate(100, 100);
}
