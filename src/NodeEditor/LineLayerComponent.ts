/* eslint-disable import/no-unresolved, import/extensions */

import { Node } from 'rete';
import { NodeData, WorkerInputs } from 'rete/types/core/data.js';

import LayerComponent from './LayerComponent';
import ColorPickerControl from './ColorPickerControl.jsx';
import SliderControl from './SliderControl.jsx';

const layoutProperties = {};
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

const KEY = 'LineLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
 */
export default class LineLayerComponent extends LayerComponent {
  type = 'line';

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
