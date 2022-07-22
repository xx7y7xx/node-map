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
    const jsonNodeValue = inputs.json[0];

    if (!jsonNodeValue) {
      return;
    }

    this.markers.forEach((m) => {
      m.remove();
    });
    this.markers = [];

    jsonNodeValue.filter((lngLat) => lngLat[0] && lngLat[1]).forEach((lngLat) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(window.mapbox);
      this.markers.push(marker);
    });

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get('preview')
      .setValue(`${JSON.stringify(jsonNodeValue)}`);
  }
}
