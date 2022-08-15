import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';

const LAYER_ID = 'nm-line-string-layer';
const INPUT_KEY = 'sourceId';
const CONTROL_KEY = 'colorControl';
const CONTROL_KEY_LINE_WIDTH = 'lineWidthWidth';
export default class MapLayerComponent extends Rete.Component {
  constructor() {
    super('Map Layer Node');

    window.mapbox.on('load', () => {
      this.mapReady = true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    return node
      .addInput(input)
      .addControl(new ColorPickerControl(this.editor, CONTROL_KEY, node, { label: 'color' }))
      .addControl(new SliderControl(this.editor, CONTROL_KEY_LINE_WIDTH, node, { label: 'line-width' }));
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs) {
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    const sourceId = inputs[INPUT_KEY][0];

    if (!sourceId) {
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(LAYER_ID)) {
        map.removeLayer(LAYER_ID);
      }
      return;
    }

    if (this.mapReady) {
      this.renderLineString(sourceId, node);
    } else {
      window.mapbox.on('load', () => {
        this.renderLineString(sourceId, node);
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderLineString(sourceId, node) {
    const map = window.mapbox;

    if (map.getLayer(LAYER_ID)) {
      map.removeLayer(LAYER_ID);
    }

    window.mapbox.addLayer({
      id: LAYER_ID,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': node.data[CONTROL_KEY],
        'line-width': node.data[CONTROL_KEY_LINE_WIDTH],
      },
    });
  }
}
