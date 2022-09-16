/* eslint-disable no-param-reassign */

import Rete from 'rete';
import InputControl from './InputControl';
import SliderControl from './SliderControl';

const CONTROL_KEY_LNG = 'inputControlLng';
const CONTROL_KEY_LAT = 'inputControlLat';
const CONTROL_KEY_ZOOM = 'inputControlZoom';
const defaultZoom = 9;

const updateValues = (node) => (event) => {
  const map = event.target;
  node.controls.get(CONTROL_KEY_LNG).setValue(map.getCenter().lng);
  node.controls.get(CONTROL_KEY_LAT).setValue(map.getCenter().lat);
  node.controls.get(CONTROL_KEY_ZOOM).setValue(map.getZoom());
};

/**
 * Control the center and other props of map
 */
export default class MapComponent extends Rete.Component {
  constructor() {
    super('Map Node'); // node title
  }

  builder(node) {
    window.mapbox.on('dragend', updateValues(node));
    window.mapbox.on('zoomend', updateValues(node));

    return node
      .addControl(new InputControl(this.editor, CONTROL_KEY_LNG, node, { label: 'lng' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_LAT, node, { label: 'lat' }))
      .addControl(new SliderControl(this.editor, CONTROL_KEY_ZOOM, node, { label: 'zoom' }));
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  worker(node, inputs, outputs) {
    // outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];

    if (window.mapbox) {
      console.debug('[MapComponent] fly to position');
      window.mapbox.flyTo({
        center: [node.data[CONTROL_KEY_LNG], node.data[CONTROL_KEY_LAT]],
        zoom: node.data[CONTROL_KEY_ZOOM] || defaultZoom,
      });
    }
  }
}
