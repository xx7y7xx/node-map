import LayerComponent from './LayerComponent';
import ColorPickerControl from './ColorPickerControl';
import SelectControl from './SelectControl';
import InputControl from './InputControl';
import SliderAndExpressionControl from './SliderAndExpressionControl';

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

const KEY = 'SymbolLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
 */
export default class SymbolLayerComponent extends LayerComponent {
  constructor() {
    super(KEY);

    this.type = 'symbol';
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
