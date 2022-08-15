import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';

const LAYER_ID = 'nm-line-string-layer';
const INPUT_KEY = 'sourceId';
export default class MapLayerComponent extends Rete.Component {
  constructor() {
    super('MapLayer');

    window.mapbox.on('load', () => {
      this.mapReady = true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    return node
      .addInput(input);
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
      this.renderLineString(sourceId);
    } else {
      window.mapbox.on('load', () => {
        this.renderLineString(sourceId);
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderLineString(sourceId) {
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
        'line-color': '#888',
        'line-width': 8,
      },
    });
  }
}
