import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SelectControl from './SelectControl';
import InputControl from './InputControl';
import SliderAndExpressionControl from './SliderAndExpressionControl';

const INPUT_KEY = 'sourceId';

const KEY = 'SymbolLayer';

const defaultTextFont = ['Open Sans Regular', 'Arial Unicode MS Regular'];

const layoutProperties = {
  'text-size': {
    defaultValue: 0,
    control: SliderAndExpressionControl,
  },
  'text-font': {
    defaultValue: ['Open Sans Regular', 'Arial Unicode MS Regular'],
    control: SelectControl,
    props: {
      mode: 'multiple',
      options: defaultTextFont.map((item) => ({ value: item, label: item })),
    },
  },
  'text-field': {
    defaultValue: '',
    control: InputControl,
  },
};
const paintProperties = {
  'text-color': {
    defaultValue: '#000000',
    control: ColorPickerControl,
  },
};
const allProperties = { ...layoutProperties, ...paintProperties };

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
 */
export default class SymbolLayerComponent extends Rete.Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  static inputKey = INPUT_KEY;

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    node
      .addInput(input);

    Object.keys(allProperties).forEach((key) => {
      const { control: Ctrl, defaultValue, props = {} } = allProperties[key];

      if (!node.data[key] === undefined) {
        node.data[key] = defaultValue;
      }

      node.addControl(new Ctrl(this.editor, key, node, { label: key, ...props }));
    });
  }

  worker(node, inputs) {
    console.debug('SymbolLayerComponent worker', node, inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const layerId = `${sourceId}LayerIdSymbol`;

    if (!sourceId) {
      console.debug('SymbolLayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        console.debug('SymbolLayerComponent remove layer', layerId);
        map.removeLayer(layerId);
      }
      return;
    }
    console.debug('SymbolLayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const layerId = `${sourceId}LayerIdSymbol`;

    if (map.getLayer(layerId)) {
      console.debug('SymbolLayerComponent layer exists', layerId);

      Object.keys(layoutProperties).forEach((key) => {
        if (key === 'text-field') {
          map.setLayoutProperty(layerId, key, this.convertTextField(node.data[key])); // TODO
        } else {
          map.setLayoutProperty(layerId, key, node.data[key]);
        }
      });
      Object.keys(paintProperties).forEach((key) => {
        map.setPaintProperty(layerId, key, node.data[key]);
      });
    } else {
      console.debug('SymbolLayerComponent layer doesnt exist', layerId);
      window.mapbox.addLayer({
        id: layerId,
        type: 'symbol',
        source: sourceId,
        paint: {
          ...Object.keys(paintProperties).reduce((a, v) => ({ ...a, [v]: node.data[v] }), {}),
        },
        layout: {
          ...Object.keys(layoutProperties).reduce((a, v) => ({
            ...a, [v]: v === 'text-field' ? this.convertTextField(node.data[v]) : node.data[v],
          }), {}),
        },
      });
    }
  }

  convertTextField(textField) {
    const inputBoxStr = textField;
    if (!inputBoxStr.startsWith('[')) {
      return textField;
    }
    return JSON.parse(textField);
  }
}
