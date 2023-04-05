import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import InputNumberControl from './InputNumberControl';
import SliderAndExpressionControl from './SliderAndExpressionControl';
import InputControl from './InputControl';
import ColorPickerAndExpressionControl from './ColorPickerAndExpressionControl';
import ExpressionControl from './ExpressionControl';
import { genLayer } from './helpers';

const paintProperties = {
  'circle-color': {
    defaultValue: '#000000',
    control: ColorPickerAndExpressionControl,
  },
  'circle-radius': {
    defaultValue: 0,
    control: SliderAndExpressionControl,
  },
  'circle-stroke-color': {
    defaultValue: '#000000',
    control: ColorPickerAndExpressionControl,
  },
  'circle-stroke-width': {
    defaultValue: 0,
    control: InputNumberControl,
  },
};
const allProperties = { ...paintProperties };

const KEY = 'CircleLayer';
const INPUT_KEY = 'sourceId';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
 */
export default class CircleLayerComponent extends Rete.Component {
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
      const { control: Ctrl, defaultValue, props = {} } = allProperties[key];

      if (!node.data[key] === undefined) {
        node.data[key] = defaultValue;
      }

      node.addControl(new Ctrl(this.editor, key, node, { label: key, ...props }));
    });
  }

  worker(node, inputs) {
    console.debug('CircleLayerComponent worker', node, inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const { layerId } = node.data;

    if (!sourceId) {
      console.debug('CircleLayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        console.debug('CircleLayerComponent remove layer', layerId);
        map.removeLayer(layerId);
      }
      return;
    }
    console.debug('CircleLayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const { layerId } = node.data;

    if (map.getLayer(layerId)) {
      console.debug('CircleLayerComponent layer exists', layerId);
      map.setFilter(layerId, node.data.filter);

      Object.keys(paintProperties).forEach((key) => {
        map.setPaintProperty(layerId, key, node.data[key]);
      });
    } else {
      console.debug('CircleLayerComponent layer doesnt exist', layerId);
      const config = {
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
          ...Object.keys(paintProperties).reduce((a, v) => ({ ...a, [v]: node.data[v] }), {}),
        },
      };
      if (node.data.filter) {
        config.filter = node.data.filter;
      }
      console.debug('CircleLayerComponent add layer', config);
      window.mapbox.addLayer(config);
    }
  }
}
