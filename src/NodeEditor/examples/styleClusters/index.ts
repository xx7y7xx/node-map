import GeoJSONSourceComponent, {
  CONTROL_KEY_SOURCE_ID,
} from 'NodeEditor/GeoJSONSourceComponent';
import MapComponent, {
  CONTROL_KEY_LNGLAT,
  CONTROL_KEY_ZOOM,
} from 'NodeEditor/MapComponent';
import RemoteDataComponent from 'NodeEditor/RemoteDataComponent';
import CircleLayerComponent from 'NodeEditor/CircleLayerComponent';
import SymbolLayerComponent from 'NodeEditor/SymbolLayerComponent';

const jsonNodeExample = async () => {
  const { editor } = window.___nodeMap;

  if (!editor) {
    return;
  }

  const m = editor.components;

  const mapNode = await (m.get(MapComponent.key) as MapComponent).createNode({
    [CONTROL_KEY_LNGLAT]: [-103.5917, 40.6699],
    [CONTROL_KEY_ZOOM]: 3,
  });
  const remoteDataNode = await (
    m.get(RemoteDataComponent.key) as RemoteDataComponent
  ).createNode({
    [RemoteDataComponent.controlKeyUrl]:
      'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
  });
  const geojsonSourceNode = await (
    m.get(GeoJSONSourceComponent.key) as GeoJSONSourceComponent
  ).createNode({
    [CONTROL_KEY_SOURCE_ID]: 'earthquakes',
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });
  const circleLayerNode = await (
    m.get(CircleLayerComponent.key) as CircleLayerComponent
  ).createNode({
    filter: ['has', 'point_count'],
    // paint: {
    //   // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    //   // with three steps to implement three types of circles:
    //   //   * Blue, 20px circles when point count is less than 100
    //   //   * Yellow, 30px circles when point count is between 100 and 750
    //   //   * Pink, 40px circles when point count is greater than or equal to 750
    //   'circle-color': [
    //     'step',
    //     ['get', 'point_count'],
    //     '#51bbd6',
    //     100,
    //     '#f1f075',
    //     750,
    //     '#f28cb1',
    //   ],
    //   'circle-radius': [
    //     'step',
    //     ['get', 'point_count'],
    //     20,
    //     100,
    //     30,
    //     750,
    //     40,
    //   ],
    // },
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1',
    ],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  });
  const symbolLayerNode = await (
    m.get(SymbolLayerComponent.key) as SymbolLayerComponent
  ).createNode({
    // layout: {
    //   'text-field': ['get', 'point_count_abbreviated'],
    //   'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    //   'text-size': 12,
    // },
    'text-field': '["get", "point_count_abbreviated"]',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  });
  const circleLayerNode2 = await (
    m.get(CircleLayerComponent.key) as CircleLayerComponent
  ).createNode({
    filter: ['!', ['has', 'point_count']],
    // paint: {
    //   'circle-color': '#11b4da',
    //   'circle-radius': 4,
    //   'circle-stroke-width': 1,
    //   'circle-stroke-color': '#fff',
    // },
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  });

  mapNode.position = [0, 0];
  remoteDataNode.position = [0, 300];
  geojsonSourceNode.position = [300, 300];
  circleLayerNode.position = [600, 0];
  symbolLayerNode.position = [900, 350];
  circleLayerNode2.position = [600, 700];

  editor.addNode(mapNode);
  editor.addNode(remoteDataNode);
  editor.addNode(geojsonSourceNode);
  editor.addNode(circleLayerNode);
  editor.addNode(symbolLayerNode);
  editor.addNode(circleLayerNode2);

  editor.connect(
    remoteDataNode.outputs.get(RemoteDataComponent.outputKey)!,
    geojsonSourceNode.inputs.get('source.data')!,
  );
  editor.connect(
    geojsonSourceNode.outputs.get(GeoJSONSourceComponent.outputKey)!,
    circleLayerNode.inputs.get(CircleLayerComponent.inputKey)!,
  );
  editor.connect(
    geojsonSourceNode.outputs.get(GeoJSONSourceComponent.outputKey)!,
    symbolLayerNode.inputs.get(SymbolLayerComponent.inputKey)!,
  );
  editor.connect(
    geojsonSourceNode.outputs.get(GeoJSONSourceComponent.outputKey)!,
    circleLayerNode2.inputs.get(CircleLayerComponent.inputKey)!,
  );

  editor.view.area.translate(100, 100);
};

export default jsonNodeExample;
