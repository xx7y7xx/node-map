import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';
import InputControl from './InputControl';
import ExpressionControl from './ExpressionControl';
import { genLayer } from './helpers';

const INPUT_KEY = 'sourceId';

const paintProperties = {
  'fill-color': {
    defaultValue: '#000000',
    control: ColorPickerControl,
  },
  'fill-opacity': {
    defaultValue: 1,
    control: SliderControl,
    props: {
      min: 0, max: 1, step: 0.1, defaultValue: 0.5,
    },
  },
};
const allProperties = { ...paintProperties };

const KEY = 'FillLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill
 */
export default class FillLayerComponent extends Rete.Component {
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
    console.debug('FillLayerComponent worker', node, inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const { layerId } = node.data;

    if (!sourceId) {
      console.debug('FillLayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        console.debug('FillLayerComponent remove layer', layerId);
        map.removeLayer(layerId);
      }
      return;
    }
    console.debug('FillLayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const { layerId } = node.data;

    if (map.getLayer(layerId)) {
      console.debug('FillLayerComponent layer exists', layerId);
      map.setFilter(layerId, node.data.filter);

      Object.keys(paintProperties).forEach((key) => {
        map.setPaintProperty(layerId, key, node.data[key]);
      });
    } else {
      console.debug('FillLayerComponent layer doesnt exist', layerId);
      const config = {
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          ...Object.keys(paintProperties).reduce((a, v) => ({ ...a, [v]: node.data[v] }), {}),
        },
      };
      if (node.data.filter) {
        config.filter = node.data.filter;
      }
      console.debug('FillLayerComponent add layer', config);
      window.mapbox.addLayer(config);
    }
  }
}
