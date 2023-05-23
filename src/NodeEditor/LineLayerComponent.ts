/* eslint-disable import/no-unresolved, import/extensions */

import { Node } from 'rete';
import { NodeData, WorkerInputs } from 'rete/types/core/data.js';

import LayerComponent from './LayerComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';
import SelectControl, { genOpts } from './SelectControl';
import LineDashArrayControl from './LineDashArrayControl';

const layoutProperties = {
  // Optional enum. One of "butt", "round", "square". Defaults to "butt".
  'line-cap': {
    defaultValue: 'round',
    control: SelectControl,
    props: {
      options: genOpts(['butt', 'round', 'square']),
    },
  },
  // Optional enum. One of "bevel", "round", "miter". Defaults to "miter".
  'line-join': {
    defaultValue: 'round',
    control: SelectControl,
    props: {
      options: genOpts(['bevel', 'round', 'miter']),
    },
  },
};
const paintProperties = {
  'line-color': {
    defaultValue: '#000000',
    control: ColorPickerControl,
  },
  // Optional array of numbers greater than or equal to 0. Units in line widths. Disabled by line-pattern.
  'line-dasharray': {
    defaultValue: [2, 2],
    control: LineDashArrayControl,
  },
  // Optional number between 0 and 1 inclusive. Defaults to 1.
  'line-opacity': {
    defaultValue: 0.6,
    control: SliderControl,
    props: {
      min: 0,
      max: 1,
      step: 0.1,
    },
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

  layerWorker(node: NodeData, inputs: WorkerInputs) {}
}
