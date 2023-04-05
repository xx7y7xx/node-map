import LayerComponent from './LayerComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';

const paintProperties = {
  'fill-color': {
    defaultValue: '#000000',
    control: ColorPickerControl,
  },
  'fill-opacity': {
    defaultValue: 1,
    control: SliderControl,
    props: {
      min: 0, max: 1, step: 0.1, defaultValue: 0.5,
    },
  },
};
const allProperties = { ...paintProperties };

const KEY = 'FillLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill
 */
export default class FillLayerComponent extends LayerComponent {
  constructor() {
    super(KEY);

    this.type = 'fill';
    this.allProperties = allProperties;
    this.paintProperties = paintProperties;
  }

  static key = KEY;

  layerBuilder(node) {
  }

  layerWorker(node, inputs) {
  }
}
