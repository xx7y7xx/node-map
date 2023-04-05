import Rete from 'rete';
import { genLayer } from './helpers';
import InputControl from './InputControl';
import ExpressionControl from './ExpressionControl';

import { stringSocket } from './UploadCsvComponent';
// import ColorPickerControl from './ColorPickerControl';
// import SliderControl from './SliderControl';
// import InputControl from './InputControl';
// import ExpressionControl from './ExpressionControl';
// import { genLayer } from './helpers';

const INPUT_KEY = 'sourceId';

// const paintProperties = {
//   'fill-color': {
//     defaultValue: '#000000',
//     control: ColorPickerControl,
//   },
//   'fill-opacity': {
//     defaultValue: 1,
//     control: SliderControl,
//     props: {
//       min: 0, max: 1, step: 0.1, defaultValue: 0.5,
//     },
//   },
// };
// const allProperties = { ...paintProperties };

// const KEY = 'FillLayer';

export default class LayerComponent extends Rete.Component {
  // constructor(name) {
  //   super(`${name}Layer`);
  // }

  static inputKey = INPUT_KEY;

  async builder(node) {
    // Initial the layer ID input box with value
    if (!node.data.layerId) {
      node.data.layerId = genLayer();
    }

    await this.layerBuilder(node);

    node
      .addInput(new Rete.Input(INPUT_KEY, 'sourceId', stringSocket))
      .addControl(new InputControl(this.editor, 'layerId', node, { label: 'layerId', disabled: true }))
      .addControl(new ExpressionControl(this.editor, 'filter', node, { label: 'filter' }));

    // add layer controls
    Object.keys(this.allProperties).forEach((key) => {
      const { control: Ctrl, defaultValue, props = {} } = this.allProperties[key];

      if (!node.data[key] === undefined) {
        node.data[key] = defaultValue;
      }

      node.addControl(new Ctrl(this.editor, key, node, { label: key, ...props }));
    });

    return node;
  }

  worker(node, inputs, outputs, ...args) {
    console.debug('LayerComponent worker', node, inputs);

    const sourceId = inputs[INPUT_KEY][0];
    const { layerId } = node.data;

    this.layerWorker(node, inputs, outputs, ...args);

    // if node link disconnect, then clear the layer on map
    if (!sourceId) {
      console.debug('LayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        console.debug('LayerComponent remove layer', layerId);
        map.removeLayer(layerId);
      }
      return;
    }
    console.debug('LayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const { layerId } = node.data;

    if (map.getLayer(layerId)) {
      console.debug('LayerComponent layer exists', layerId);
      map.setFilter(layerId, node.data.filter);

      Object.keys(this.layoutProperties).forEach((key) => {
        if (key === 'text-field') {
          map.setLayoutProperty(layerId, key, this.convertTextField(node.data[key])); // TODO
        } else {
          map.setLayoutProperty(layerId, key, node.data[key]);
        }
      });
      Object.keys(this.paintProperties).forEach((key) => {
        map.setPaintProperty(layerId, key, node.data[key]);
      });
    } else {
      console.debug('LayerComponent layer doesnt exist', layerId);
      const config = {
        id: layerId,
        type: this.type, // 'line',
        source: sourceId,
        // layout: {
        //   'line-join': 'round',
        //   'line-cap': 'round',
        // },
        layout: {
          ...Object.keys(this.layoutProperties).reduce((a, v) => ({
            ...a, [v]: v === 'text-field' ? this.convertTextField(node.data[v]) : node.data[v],
          }), {}),
        },
        paint: {
          ...Object.keys(this.paintProperties).reduce((a, v) => ({ ...a, [v]: node.data[v] }), {}),
        },
      };
      if (node.data.filter) {
        config.filter = node.data.filter;
      }
      console.debug('LayerComponent add layer', config);
      window.mapbox.addLayer(config);
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
