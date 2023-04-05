/* eslint-disable import/no-unresolved, import/extensions */

import { Node } from 'rete';
import { NodeData, WorkerInputs } from 'rete/types/core/data';

import LayerComponent from './LayerComponent';
import ColorPickerControl from './ColorPickerControl.jsx';
import SelectControl from './SelectControl.js';
import InputControl from './InputControl.js';
import SliderAndExpressionControl from './SliderAndExpressionControl.jsx';

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

const KEY = 'SymbolLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
 */
export default class SymbolLayerComponent extends LayerComponent {
  type = 'symbol';

  layoutProperties = layoutProperties;

  paintProperties = paintProperties;

  constructor() {
    super(KEY);
  }

  static key = KEY;

  async layerBuilder(node: Node) {
    return null;
  }

  layerWorker(node: NodeData, inputs: WorkerInputs) {
  }
}
