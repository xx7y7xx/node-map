import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';

const KEY = 'FillLayer';
export const INPUT_KEY = 'sourceId';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill
 */
export default class FillLayerComponent extends Rete.Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    return node
      .addInput(input)
      .addControl(new ColorPickerControl(this.editor, 'fill-color', node, { label: 'fill-color' }))
      .addControl(new SliderControl(this.editor, 'fill-opacity', node, {
        label: 'fill-opacity', min: 0, max: 1, step: 0.1, defaultValue: 0.5,
      }));
  }

  worker(node, inputs) {
    console.debug('FillLayerComponent worker', inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const layerId = `${sourceId}fillLayerId`;

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
    const layerId = `${sourceId}fillLayerId`; // TODO dedup

    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'fill-color', node.data['fill-color']);
      map.setPaintProperty(layerId, 'fill-opacity', node.data['fill-opacity']);
    } else {
      console.debug('FillLayerComponent addLayer');
      window.mapbox.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': node.data['fill-color'],
          'fill-opacity': node.data['fill-opacity'],
        },
      });
    }
  }
}
