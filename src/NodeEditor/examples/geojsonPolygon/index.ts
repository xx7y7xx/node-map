import FillLayerComponent from 'NodeEditor/FillLayerComponent';
import MapComponent, {
  CONTROL_KEY_LNGLAT,
  CONTROL_KEY_ZOOM,
} from 'NodeEditor/MapComponent';
import JsonComponent, { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import GeoJSONSourceComponent, {
  CONTROL_KEY_SOURCE_ID,
} from '../../GeoJSONSourceComponent';
import LineLayerComponent from '../../LineLayerComponent';
import geojson from './data.json';

export default async function Example() {
  const { editor } = window.___nodeMap;

  if (!editor) {
    console.error('editor is undefined in geojsonPolygon example');
    return;
  }

  const m = editor?.components;

  const mapNode = await (m.get(MapComponent.key) as MapComponent).createNode({
    [CONTROL_KEY_LNGLAT]: [-68.137343, 45.137451],
    [CONTROL_KEY_ZOOM]: 5,
  });
  const jsonNode = await (m.get(JsonComponent.key) as JsonComponent).createNode(
    {
      [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson },
    },
  );
  const geojsonSourceNode = await (
    m.get(GeoJSONSourceComponent.key) as GeoJSONSourceComponent
  ).createNode({ [CONTROL_KEY_SOURCE_ID]: 'maine' });

  console.debug(
    'Example components get',
    editor.components,
    editor.components.get(LineLayerComponent.key),
  );
  const lineLayerNode = await (
    m.get(LineLayerComponent.key) as LineLayerComponent
  ).createNode({ 'line-color': '#000', 'line-width': 3 });
  const fillLayerNode = await (
    m.get(FillLayerComponent.key) as FillLayerComponent
  ).createNode({ 'fill-color': '#0080ff' });

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
    jsonNode.outputs.get(OUTPUT_KEY)!,
    geojsonSourceNode.inputs.get(GeoJSONSourceComponent.inputKey)!,
  );
  editor.connect(
    geojsonSourceNode.outputs.get(GeoJSONSourceComponent.outputKey)!,
    lineLayerNode.inputs.get(LineLayerComponent.inputKey)!,
  );
  editor.connect(
    geojsonSourceNode.outputs.get(GeoJSONSourceComponent.outputKey)!,
    fillLayerNode.inputs.get(FillLayerComponent.inputKey)!,
  );

  editor.view.area.translate(100, 100);
}
