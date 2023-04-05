import LayerComponent from './LayerComponent';
import InputNumberControl from './InputNumberControl';
import SliderAndExpressionControl from './SliderAndExpressionControl';
import ColorPickerAndExpressionControl from './ColorPickerAndExpressionControl';

const layoutProperties = {
};
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
const allProperties = { ...layoutProperties, ...paintProperties };

const KEY = 'CircleLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
 */
export default class CircleLayerComponent extends LayerComponent {
  constructor() {
    super(KEY);

    this.type = 'circle';
    this.allProperties = allProperties;
    this.layoutProperties = layoutProperties;
    this.paintProperties = paintProperties;
  }

  static key = KEY;

  layerBuilder(node) {
  }

  layerWorker(node, inputs) {
  }
}
