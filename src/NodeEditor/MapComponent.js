import Rete from 'rete';
import InputControl from './InputControl';

const CONTROL_KEY_LNG = 'inputControlLng';
const CONTROL_KEY_LAT = 'inputControlLat';
const CONTROL_KEY_ZOOM = 'inputControlZoom';
const defaultZoom = 9;

/**
 * Control the center and other props of map
 */
export default class MapComponent extends Rete.Component {
  constructor() {
    super('Map Node'); // node title
  }

  builder(node) {
    return node
      .addControl(new InputControl(this.editor, CONTROL_KEY_LNG, node, { label: 'lng' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_LAT, node, { label: 'lat' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_ZOOM, node, { label: 'zoom' }));
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  worker(node, inputs, outputs) {
    // eslint-disable-next-line no-param-reassign
    // outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];

    if (window.mapbox) {
      window.mapbox.flyTo({
        center: [node.data[CONTROL_KEY_LNG], node.data[CONTROL_KEY_LAT]],
        zoom: node.data[CONTROL_KEY_ZOOM] || defaultZoom,
      });
    }
  }
}
