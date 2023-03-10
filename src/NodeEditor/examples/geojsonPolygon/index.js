import { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import { INPUT_KEY as MAP_GEOJSON_INPUT_KEY, OUTPUT_KEY as MAP_GEOJSON_OUTPUT_KEY, CONTROL_KEY_SOURCE_ID } from '../../MapGeoJsonComponent';
import { INPUT_KEY as MAP_LINE_LAYER_INPUT_KEY, CONTROL_KEY as MAP_LINE_LAYER_CONTROL_KEY, CONTROL_KEY_LINE_WIDTH } from '../../MapLayerComponent';
import geojson from './data.json';

export default async function Example() {
  const { editor, allComponents } = window.___nodeMap;

  const {
    mapComponent, jsonComponent, mapGeoJsonComponent, mapLayerComponent,
  } = allComponents;

  const mapNode = await mapComponent.createNode();
  const jsonNode = await jsonComponent.createNode({ [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson } });
  const mapGeoJsonNode = await mapGeoJsonComponent.createNode({ [CONTROL_KEY_SOURCE_ID]: 'maine' });
  const mapLayerNode = await mapLayerComponent.createNode({ [MAP_LINE_LAYER_CONTROL_KEY]: '#ec1313', [CONTROL_KEY_LINE_WIDTH]: 3 });

  jsonNode.position = [0, 250];
  mapGeoJsonNode.position = [270, 250];
  mapLayerNode.position = [600, 250];

  editor.addNode(mapNode);
  editor.addNode(jsonNode);
  editor.addNode(mapGeoJsonNode);
  editor.addNode(mapLayerNode);

  editor.connect(
    jsonNode.outputs.get(OUTPUT_KEY),
    mapGeoJsonNode.inputs.get(MAP_GEOJSON_INPUT_KEY),
  );
  editor.connect(
    mapGeoJsonNode.outputs.get(MAP_GEOJSON_OUTPUT_KEY),
    mapLayerNode.inputs.get(MAP_LINE_LAYER_INPUT_KEY),
  );

  editor.view.area.translate(100, 100);
}
