/* eslint-disable import/no-unresolved, import/extensions */

import { Node } from 'rete';
import { NodeData, WorkerInputs } from 'rete/types/core/data';

import LayerComponent from './LayerComponent';
import ColorPickerControl from './ColorPickerControl';
import SelectControl, { genOpts } from './SelectControl';
import InputControl from './InputControl';
import SliderAndExpressionControl from './SliderAndExpressionControl';
import SwitchControl from './SwitchControl';
import InputNumberControl from './InputNumberControl';
import LineDashArrayControl from './LineDashArrayControl';

const layoutProperties = {
  'icon-allow-overlap': { defaultValue: true, control: SwitchControl },
  // Optional enum. One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right". Defaults to "center". Requires icon-image.
  'icon-anchor': {
    defaultValue: 'center',
    control: SelectControl,
    props: {
      options: genOpts([
        'center',
        'left',
        'right',
        'top',
        'bottom',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ]),
    },
  },
  'icon-ignore-placement': { defaultValue: true, control: SwitchControl },
  'icon-image': {
    defaultValue: 'airport-15', // sprite from https://docs.mapbox.com/help/glossary/sprite/
    control: InputControl,
  },
  // Optional array of numbers. Defaults to [0,0]. Requires icon-image.
  'icon-offset': {
    defaultValue: [0, 0],
    control: LineDashArrayControl,
  },
  'icon-rotate': { defaultValue: 90, control: InputNumberControl },
  // one of map, viewport, auto
  'icon-rotation-alignment': {
    defaultValue: 'map',
    control: SelectControl,
    props: {
      options: genOpts(['map', 'viewport', 'auto']),
    },
  },
  // Optional number greater than or equal to 0. Units in factor of the original icon size. Defaults to 1. Requires icon-image.
  'icon-size': {
    defaultValue: 1,
    control: InputNumberControl,
  },

  // Optional enum. One of "point", "line", "line-center". Defaults to "point".
  'symbol-placement': {
    defaultValue: 'line',
    control: SelectControl,
    props: {
      options: genOpts(['point', 'line', 'line-center']),
    },
  },
  // Optional number greater than or equal to 1. Units in pixels. Defaults to 250. Requires symbol-placement to be "line"
  'symbol-spacing': {
    defaultValue: 250,
    control: InputNumberControl,
    props: { min: 1 },
  },

  'text-size': {
    defaultValue: 0,
    control: SliderAndExpressionControl,
  },
  'text-font': {
    defaultValue: ['Open Sans Regular', 'Arial Unicode MS Regular'],
    control: SelectControl,
    props: {
      mode: 'multiple',
      options: genOpts(['Open Sans Regular', 'Arial Unicode MS Regular']),
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

  layerWorker(node: NodeData, inputs: WorkerInputs) {}
}
