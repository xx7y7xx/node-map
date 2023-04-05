import LayerComponent from './LayerComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';

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
const allProperties = { ...paintProperties };

const KEY = 'LineLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
 */
export default class LineLayerComponent extends LayerComponent {
  constructor() {
    super(KEY);

    this.type = 'line';
    this.allProperties = allProperties;
    this.paintProperties = paintProperties;
  }

  static key = KEY;

  layerBuilder(node) {
  }

  layerWorker(node, inputs) {
  }
}
