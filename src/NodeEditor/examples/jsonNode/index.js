import { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import { INPUT_KEY } from '../../MapLayerV2Component';
import geojson from './data.json';

const jsonNodeExample = async () => {
  const { editor, allComponents } = window.___nodeMap;

  // Remove all nodes/connections in editor
  // TODO also need remove all map data
  editor.clear();

  const jsonNode = await allComponents.jsonComponent.createNode({ [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson } });
  const mapLayerV2Node = await allComponents.mapLayerV2Component.createNode();

  mapLayerV2Node.position = [300, -100];

  editor.addNode(jsonNode);
  editor.addNode(mapLayerV2Node);

  editor.connect(
    jsonNode.outputs.get(OUTPUT_KEY),
    mapLayerV2Node.inputs.get(INPUT_KEY),
  );

  editor.view.area.translate(100, 100);
};

export default jsonNodeExample;
