import { CONTROL_KEY, OUTPUT_KEY } from '../../JsonComponent';
import { INPUT_KEY } from '../../MapLayerV3Component';
import geojson from './data.json';

const jsonNodeExample = async () => {
  const { editor, allComponents } = window.___nodeMap;

  const jsonNode = await allComponents.jsonComponent.createNode({ [CONTROL_KEY]: { text: JSON.stringify(geojson, null, 2), obj: geojson } });
  const mapLineLayerNode = await allComponents.mapLineLayerComponent.createNode();

  mapLineLayerNode.position = [300, -100];

  editor.addNode(jsonNode);
  editor.addNode(mapLineLayerNode);

  editor.connect(
    jsonNode.outputs.get(OUTPUT_KEY),
    mapLineLayerNode.inputs.get(INPUT_KEY),
  );

  editor.view.area.translate(100, 100);
};

export default jsonNodeExample;
