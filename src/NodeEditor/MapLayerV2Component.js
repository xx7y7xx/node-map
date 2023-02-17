/* eslint-disable no-param-reassign */

import Rete from 'rete';

import { mapboxSourceLayerIdPrefix } from 'constants';
import { objectSocket } from './JsonComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';
import InputControl from './InputControl';
import MapControl from './MapControl';

// const LAYER_ID = 'nm-line-string-layer';
// const LAYER_ID_POINT = 'nm-point-layer';
export const INPUT_KEY = 'geojson';
const CONTROL_KEY_LINE_COLOR = 'controlKeyLineColor';
const CONTROL_KEY_LINE_WIDTH = 'controlKeyLineWidth';
const CONTROL_KEY_COLOR_BASE_ON_FIELD = 'controlKeyColorBaseOnField';
// const CONTROL_KEY_GEOJSON = 'controlKeyGeojson';
const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';
const CONTROL_KEY_MAP = 'controlKeyMap';

// MapLayerV2Component = MapGeoJsonComponent + MapLayerComponent
export default class MapLayerV2Component extends Rete.Component {
  constructor() {
    super('Map Layer V2 Node');
  }

  // eslint-disable-next-line class-methods-use-this
  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'GeoJSON', objectSocket);

    // Initial the source ID input box with value
    if (!node.data[CONTROL_KEY_SOURCE_ID]) {
      node.data[CONTROL_KEY_SOURCE_ID] = (`${mapboxSourceLayerIdPrefix}${Math.round(Math.random() * 1000)}`);
    }

    node
      .addInput(input)
      .addControl(new ColorPickerControl(this.editor, CONTROL_KEY_LINE_COLOR, node, { label: 'color' }))
      .addControl(new SliderControl(this.editor, CONTROL_KEY_LINE_WIDTH, node, { label: 'line-width' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_COLOR_BASE_ON_FIELD, node, { label: 'Color base on field' }))
      // .addControl(new TextControl(this.editor, CONTROL_KEY_GEOJSON, node, true))
      .addControl(new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, { label: 'sourceId' }))
      .addControl(new MapControl(this.editor, CONTROL_KEY_MAP, { sourceId: node.data[CONTROL_KEY_SOURCE_ID] }));
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs) {
    // inputs[INPUT_KEY]=[] // no data
    // inputs[INPUT_KEY]=[[[103.8254528,1.2655414]]]
    const geojson = inputs[INPUT_KEY][0];

    const mapCtrl = this.editor.nodes
      .find((n) => n.id === node.id)
      .controls
      .get(CONTROL_KEY_MAP);

    const lineCfg = {
      lineColor: node.data[CONTROL_KEY_LINE_COLOR],
      lineWidth: node.data[CONTROL_KEY_LINE_WIDTH],
      colorBaseOnField: node.data[CONTROL_KEY_COLOR_BASE_ON_FIELD],
    };

    if (!geojson) {
      // no data input, maybe link disconnect
      // this.updateText(node, '');

      // Remove layers
      // mapCtrl.removeLayers();
      mapCtrl.removeData();
      return;
    }

    mapCtrl.setSourceAndLayer(geojson, lineCfg);
  }
}
