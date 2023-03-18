import GeoJSONSourceComponent, { INPUT_KEY as GEOJSON_SOURCE_INPUT_KEY, OUTPUT_KEY as GEOJSON_SOURCE_OUTPUT_KEY, CONTROL_KEY_SOURCE_ID } from 'NodeEditor/GeoJSONSourceComponent';
import LineLayerComponent, { INPUT_KEY as LINE_LAYER_INPUT_KEY } from 'NodeEditor/LineLayerComponent';
import MapComponent, { CONTROL_KEY_LAT, CONTROL_KEY_LNG, CONTROL_KEY_ZOOM } from 'NodeEditor/MapComponent';
import JsonComponent, { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import geojson from './data.json';

const jsonNodeExample = async () => {
  const { editor } = window.___nodeMap;
  const m = editor.components;

  const mapNode = await m.get(MapComponent.key).createNode({
    [CONTROL_KEY_LNG]: -122.486052,
    [CONTROL_KEY_LAT]: 37.830348,
    [CONTROL_KEY_ZOOM]: 14,
  });
  const jsonNode = await m.get(JsonComponent.key).createNode({ [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson } });
  const geojsonSourceNode = await m.get(GeoJSONSourceComponent.key).createNode({ [CONTROL_KEY_SOURCE_ID]: 'route' });
  const lineLayerNode = await m.get(LineLayerComponent.key).createNode({
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    'line-color': '#888888',
    'line-width': 8,
  });

  mapNode.position = [0, -200];
  geojsonSourceNode.position = [230, 0];
  lineLayerNode.position = [530, 0];

  editor.addNode(mapNode);
  editor.addNode(jsonNode);
  editor.addNode(geojsonSourceNode);
  editor.addNode(lineLayerNode);

  editor.connect(
    jsonNode.outputs.get(OUTPUT_KEY),
    geojsonSourceNode.inputs.get(GEOJSON_SOURCE_INPUT_KEY),
  );
  editor.connect(
    geojsonSourceNode.outputs.get(GEOJSON_SOURCE_OUTPUT_KEY),
    lineLayerNode.inputs.get(LINE_LAYER_INPUT_KEY),
  );

  editor.view.area.translate(100, 100);
};

export default jsonNodeExample;
