import MapComponent, {
  CONTROL_KEY_LNGLAT,
  CONTROL_KEY_ZOOM,
} from 'NodeEditor/MapComponent';

const mapProjection = async () => {
  const { editor } = window.___nodeMap;

  if (!editor) {
    return;
  }

  const m = editor.components;

  const mapNode = await (m.get(MapComponent.key) as MapComponent).createNode({
    [CONTROL_KEY_LNGLAT]: [0, 0],
    [CONTROL_KEY_ZOOM]: 0.4,
  });

  mapNode.position = [0, 0];

  editor.addNode(mapNode);

  editor.view.area.translate(100, 100);
};

export default mapProjection;
