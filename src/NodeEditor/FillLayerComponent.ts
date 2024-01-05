/* eslint-disable import/no-unresolved, import/extensions */

import { Node } from 'rete';
import { NodeData, WorkerInputs } from 'rete/types/core/data.js';

import LayerComponent from './LayerComponent';
import SliderControl from './SliderControl';
import ColorPickerAndExpressionControl from './ColorPickerAndExpressionControl';

const layoutProperties = {};
const paintProperties = {
  'fill-color': {
    defaultValue: '#000000',
    control: ColorPickerAndExpressionControl,
    input: true,
  },
  'fill-opacity': {
    defaultValue: 1,
    control: SliderControl,
    props: {
      min: 0,
      max: 1,
      step: 0.1,
      defaultValue: 0.5,
    },
  },
};

const KEY = 'FillLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill
 */
export default class FillLayerComponent extends LayerComponent {
  type = 'fill';

  layoutProperties = layoutProperties;

  paintProperties = paintProperties;

  constructor() {
    super(KEY);
  }

  static key = KEY;

  async layerBuilder(node: Node) {
    return null;
  }

  layerWorker(node: NodeData, inputs: WorkerInputs) {}
}
