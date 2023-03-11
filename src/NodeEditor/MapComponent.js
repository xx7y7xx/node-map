import Rete from 'rete';
import * as turf from '@turf/turf';

import InputControl from './InputControl';
import SliderControl from './SliderControl';

const KEY = 'Map Node';
export const CONTROL_KEY_LNG = 'inputControlLng';
export const CONTROL_KEY_LAT = 'inputControlLat';
export const CONTROL_KEY_ZOOM = 'inputControlZoom';
const defaultZoom = 9;

const updateValues = (node) => (event) => {
  const map = event.target;
  node.controls.get(CONTROL_KEY_LNG)?.setValue(map.getCenter().lng);
  node.controls.get(CONTROL_KEY_LAT)?.setValue(map.getCenter().lat);
  node.controls.get(CONTROL_KEY_ZOOM)?.setValue(map.getZoom());
};

/**
 * Control the center and other props of map
 */
export default class MapComponent extends Rete.Component {
  constructor() {
    super(KEY); // node title
  }

  static key = KEY;

  builder(node) {
    window.mapbox.on('dragend', updateValues(node));
    window.mapbox.on('zoomend', updateValues(node));

    // window.mapbox.jumpTo({
    //   center: [node.data[CONTROL_KEY_LNG], node.data[CONTROL_KEY_LAT]],
    //   zoom: 10,
    // });
    window.mapbox.setCenter([node.data[CONTROL_KEY_LNG], node.data[CONTROL_KEY_LAT]]);
    window.mapbox.setZoom(node.data[CONTROL_KEY_ZOOM]);

    return node
      .addControl(new InputControl(this.editor, CONTROL_KEY_LNG, node, { label: 'lng' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_LAT, node, { label: 'lat' }))
      .addControl(new SliderControl(this.editor, CONTROL_KEY_ZOOM, node, { label: 'zoom' }));
  }

  worker(node, inputs, outputs) {
    // outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];

    // if (window.mapbox) {
    //   console.debug('[MapComponent] fly to position');
    //   window.mapbox.flyTo({
    //     center: [node.data[CONTROL_KEY_LNG], node.data[CONTROL_KEY_LAT]],
    //     zoom: node.data[CONTROL_KEY_ZOOM] || defaultZoom,
    //   });
    // }
  }
}
