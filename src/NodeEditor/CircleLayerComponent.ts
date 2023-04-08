/* eslint-disable import/no-unresolved, import/extensions */

import { Node } from 'rete';
import { NodeData, WorkerInputs } from 'rete/types/core/data';
import LayerComponent from './LayerComponent';
import InputNumberControl from './InputNumberControl';
import SliderAndExpressionControl from './SliderAndExpressionControl';
import ColorPickerAndExpressionControl from './ColorPickerAndExpressionControl';

const layoutProperties = {};
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

const KEY = 'CircleLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
 */
export default class CircleLayerComponent extends LayerComponent {
  type = 'circle';

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
