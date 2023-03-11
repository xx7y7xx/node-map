import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';

const KEY = 'LineLayer';
export const INPUT_KEY = 'sourceId';
// export const CONTROL_KEY = 'colorControl';
// export const CONTROL_KEY_LINE_WIDTH = 'lineWidthWidth';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
 */
export default class LineLayerComponent extends Rete.Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    return node
      .addInput(input)
      .addControl(new ColorPickerControl(this.editor, 'line-color', node, { label: 'color' }))
      .addControl(new SliderControl(this.editor, 'line-width', node, { label: 'line-width' }));
  }

  worker(node, inputs) {
    console.debug('LineLayerComponent worker', inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const layerId = `${sourceId}lineLayerId`;

    if (!sourceId) {
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      return;
    }

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const layerId = `${sourceId}lineLayerId`;

    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'line-color', node.data['line-color']);
      map.setPaintProperty(layerId, 'line-width', node.data['line-width']);
    } else {
      console.debug('LineLayerComponent addLayer');
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
          'line-color': node.data['line-color'],
          'line-width': node.data['line-width'],
        },
      });
    }
  }
}
