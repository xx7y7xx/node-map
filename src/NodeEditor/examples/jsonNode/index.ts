import JsonComponent, { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import MapLayerV3Component, { INPUT_KEY } from '../../MapLayerV3Component';
import geojson from './data.json';

const jsonNodeExample = async () => {
  const { editor } = window.___nodeMap;

  if (!editor) {
    return;
  }

  const m = editor.components;

  editor.clear();

  const jsonNode = await (m.get(JsonComponent.key) as JsonComponent).createNode(
    {
      [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson },
    },
  );
  const mapLayerV3Node = await (
    m.get(MapLayerV3Component.key) as MapLayerV3Component
  ).createNode();

  mapLayerV3Node.position = [300, -100];

  editor.addNode(jsonNode);
  editor.addNode(mapLayerV3Node);

  editor.connect(
    jsonNode.outputs.get(OUTPUT_KEY)!,
    mapLayerV3Node.inputs.get(INPUT_KEY)!,
  );

  editor.view.area.translate(100, 100);
};

export default jsonNodeExample;
