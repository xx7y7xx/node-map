import Rete from 'rete';
import mapboxgl from 'mapbox-gl';
import TextControl from './TextControl';
import { jsonSocket } from './JsonComponent';

export default class PreviewComponent extends Rete.Component {
  constructor() {
    super('Preview');
    this.markers = [];
  }

  builder(node) {
    const input = new Rete.Input('json', 'Json', jsonSocket);

    return node
      .addInput(input)
      .addControl(new TextControl(this.editor, 'preview', node, true));
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs) {
    console.debug('PreviewComponent.worker:', inputs);
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    const jsonNodeValue = inputs.json[0];

    if (!jsonNodeValue) {
      // no data input, maybe link disconnect
      this.updatePreviewControlText(node, '');
      this.clearMarkers();
      return;
    }

    this.clearMarkers();

    // filter out invalid latlng, then add markers to map
    jsonNodeValue
      .filter((lngLat) => lngLat[0] && lngLat[1])
      .forEach((lngLat) => {
        const marker = new mapboxgl.Marker()
          .setLngLat(lngLat)
          .addTo(window.mapbox);
        this.markers.push(marker);
      });

    this.updatePreviewControlText(node, `${JSON.stringify(jsonNodeValue)}`);
  }

  // update text in preview control
  updatePreviewControlText(node, text) {
    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls
      .get('preview')
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
