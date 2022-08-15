import Rete from 'rete';
import mapboxgl from 'mapbox-gl';

import TextControl from './TextControl';
import { objectSocket } from './JsonComponent';

const CONTROL_KEY = 'mapMarkersControl';
const INPUT_KEY = 'json';

export default class MapMarkersComponent extends Rete.Component {
  constructor() {
    super('MapMarkers');
    this.markers = [];

    window.mapbox.on('load', () => {
      this.mapReady = true;
    });
  }

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'JSON', objectSocket);

    return node
      .addInput(input)
      .addControl(new TextControl(this.editor, CONTROL_KEY, node, true));
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs) {
    console.debug('MapMarkersComponent.worker:', inputs);
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    const jsonNodeValue = inputs[INPUT_KEY][0];

    if (!jsonNodeValue) {
      // no data input, maybe link disconnect
      this.updateText(node, '');
      this.clearMarkers();
      return;
    }

    this.clearMarkers();

    // filter out invalid latlng, then add markers to map
    jsonNodeValue
      // .filter((lngLat) => lngLat[0] && lngLat[1])
      .forEach((feature) => {
        if (typeof feature[0] === 'number') {
          const marker = new mapboxgl.Marker()
            .setLngLat(feature)
            .addTo(window.mapbox);
          this.markers.push(marker);
        }
      });

    this.updateText(node, `${JSON.stringify(jsonNodeValue)}`);
  }

  // update text in preview control
  updateText(node, text) {
    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls
      .get(CONTROL_KEY)
      .setValue(text);
  }

  clearMarkers() {
    // clear markers on map
    this.markers.forEach((m) => {
      m.remove();
    });
    this.markers = [];
  }
}
