import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';
import { genLayer } from './helpers';
import InputControl from './InputControl';
import ExpressionControl from './ExpressionControl';

export const INPUT_KEY = 'sourceId';
// export const CONTROL_KEY = 'colorControl';
// export const CONTROL_KEY_LINE_WIDTH = 'lineWidthWidth';

const getLayerId = (sourceId) => `${sourceId}LineLayerId`;

const paintProperties = {
  'line-color': {
    defaultValue: '#000000',
    control: ColorPickerControl,
  },
  'line-width': {
    defaultValue: 0,
    control: SliderControl,
  },
};
const allProperties = { ...paintProperties };

const KEY = 'LineLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
 */
export default class LineLayerComponent extends Rete.Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  static inputKey = INPUT_KEY;

  builder(node) {
    // Initial the layer ID input box with value
    if (!node.data.layerId) {
      node.data.layerId = genLayer();
    }

    node
      .addInput(new Rete.Input(INPUT_KEY, 'sourceId', stringSocket))
      .addControl(new InputControl(this.editor, 'layerId', node, { label: 'layerId', disabled: true }))
      .addControl(new ExpressionControl(this.editor, 'filter', node, { label: 'filter' }));

    Object.keys(allProperties).forEach((key) => {
      const { control: Ctrl, defaultValue } = allProperties[key];

      if (!node.data[key] === undefined) {
        node.data[key] = defaultValue;
      }

      node.addControl(new Ctrl(this.editor, key, node, { label: key }));
    });
  }

  worker(node, inputs) {
    console.debug('LineLayerComponent worker', node, inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const { layerId } = node.data;

    if (!sourceId) {
      console.debug('LineLayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        console.debug('LineLayerComponent remove layer');
        map.removeLayer(layerId);
      }
      return;
    }
    console.debug('LineLayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const { layerId } = node.data;

    if (map.getLayer(layerId)) {
      console.debug('LineLayerComponent layer exists', layerId);
      map.setFilter(layerId, node.data.filter);

      Object.keys(paintProperties).forEach((key) => {
        map.setPaintProperty(layerId, key, node.data[key]);
      });
    } else {
      console.debug('LineLayerComponent layer doesnt exist', layerId);
      const config = {
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          ...Object.keys(paintProperties).reduce((a, v) => ({ ...a, [v]: node.data[v] }), {}),
        },
      };
      if (node.data.filter) {
        config.filter = node.data.filter;
      }
      console.debug('LineLayerComponent add layer', config);
      window.mapbox.addLayer(config);
    }
  }
}
