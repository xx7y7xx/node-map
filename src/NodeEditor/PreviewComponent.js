import Rete from 'rete';
import mapboxgl from 'mapbox-gl';
import TextControl from './TextControl';
import { jsonSocket } from './JsonComponent';

export default class PreviewComponent extends Rete.Component {
  constructor() {
    super('Preview');
  }

  builder(node) {
    const input = new Rete.Input('json', 'Json', jsonSocket);

    return node
      .addInput(input)
      .addControl(new TextControl(this.editor, 'preview', node, true));
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs, outputs) {
    const jsonNodeValue = inputs.json.length ? inputs.json[0] : node.data.json;

    jsonNodeValue.filter((lngLat) => lngLat[0] && lngLat[1]).forEach((lngLat) => {
      const marker1 = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(window.mapbox);
      console.log('marker:', marker1);
    });

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get('preview')
      .setValue(`${JSON.stringify(jsonNodeValue)}`);
  }
}
