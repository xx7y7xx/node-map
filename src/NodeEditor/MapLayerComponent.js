import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';

// const LAYER_ID = 'nm-line-string-layer';
// const LAYER_ID_POINT = 'nm-point-layer';
const INPUT_KEY = 'sourceId';
const CONTROL_KEY = 'colorControl';
const CONTROL_KEY_LINE_WIDTH = 'lineWidthWidth';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
 */
export default class MapLayerComponent extends Rete.Component { // TODO rename to "LineLayerComponent"
  constructor() {
    super('LineLayer');
  }

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    return node
      .addInput(input)
      .addControl(new ColorPickerControl(this.editor, CONTROL_KEY, node, { label: 'color' }))
      .addControl(new SliderControl(this.editor, CONTROL_KEY_LINE_WIDTH, node, { label: 'line-width' }));
  }

  worker(node, inputs) {
    const sourceId = inputs[INPUT_KEY][0];
    const layerId = `${sourceId}layerId`;
    // const layerIdPoint = `${sourceId}layerIdPoint`;

    if (!sourceId) {
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      // if (map.getLayer(layerIdPoint)) {
      //   map.removeLayer(layerIdPoint);
      // }
      return;
    }

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const layerId = `${sourceId}layerId`;
    // const layerIdPoint = `${sourceId}layerIdPoint`;

    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'line-color', node.data[CONTROL_KEY]);
      map.setPaintProperty(layerId, 'line-width', node.data[CONTROL_KEY_LINE_WIDTH]);
      // map.setPaintProperty(layerIdPoint, 'circle-color', node.data[CONTROL_KEY]);
      // map.setPaintProperty(layerIdPoint, 'circle-radius', node.data[CONTROL_KEY_LINE_WIDTH]);
    } else {
      window.mapbox.addLayer({
        // id: LAYER_ID,
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': node.data[CONTROL_KEY],
          'line-width': node.data[CONTROL_KEY_LINE_WIDTH],
        },
      });

      // window.mapbox.addLayer({
      //   // id: LAYER_ID_POINT,
      //   id: layerIdPoint,
      //   type: 'circle',
      //   source: sourceId,
      //   paint: {
      //     'circle-radius': node.data[CONTROL_KEY_LINE_WIDTH],
      //     'circle-color': node.data[CONTROL_KEY],
      //   },
      // });
    }
  }
}
