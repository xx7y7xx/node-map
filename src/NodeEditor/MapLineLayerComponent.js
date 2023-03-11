import Rete from 'rete';

import { objectSocket } from './JsonComponent';
// import ColorPickerControl from './ColorPickerControl';
// import SliderControl from './SliderControl';
import InputControl from './InputControl';
import { genSourceId } from './helpers';
import { INLINE } from './components/MapLayerConfigDrawer';
import MapControlLine from './MapControl/MapControlLine';

// const LAYER_ID = 'nm-line-string-layer';
// const LAYER_ID_POINT = 'nm-point-layer';
export const INPUT_KEY = 'geojson';
// const CONTROL_KEY_LINE_COLOR = 'controlKeyLineColor';
// const CONTROL_KEY_LINE_WIDTH = 'controlKeyLineWidth';
// const CONTROL_KEY_COLOR_BASE_ON_FIELD = 'controlKeyColorBaseOnField';
// const CONTROL_KEY_GEOJSON = 'controlKeyGeojson';
const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';
const CONTROL_KEY_MAP = 'controlKeyMap';

/**
 * Show all the input controls and other controls on the right side Drawer component
 * MapLineLayerComponent = GeoJSONSourceComponent + LineLayerComponent
 * The data stored in this node:
 * ```json
 * {
 *   "controlKeyMap": {
*      "lineColor": "#000",
 *     "lineWidth": 1,
 *     "colorBaseOnField": ""
 *   }
 * }
 * ```
 */
export default class MapLineLayerComponent extends Rete.Component {
  constructor() {
    super('Map Line Layer');
  }

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'GeoJSON', objectSocket);

    // Initial the source ID input box with value
    if (!node.data[CONTROL_KEY_SOURCE_ID]) {
      node.data[CONTROL_KEY_SOURCE_ID] = genSourceId();
    }

    node
      .addInput(input)
      // .addControl(new ColorPickerControl(this.editor, CONTROL_KEY_LINE_COLOR, node, { label: 'color' }))
      // .addControl(new SliderControl(this.editor, CONTROL_KEY_LINE_WIDTH, node, { label: 'line-width' }))
      // .addControl(new InputControl(this.editor, CONTROL_KEY_COLOR_BASE_ON_FIELD, node, { label: 'Color base on field' }))
      // .addControl(new TextControl(this.editor, CONTROL_KEY_GEOJSON, node, true))
      .addControl(new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, { label: 'sourceId', visible: false }))
      .addControl(new MapControlLine(this.editor, CONTROL_KEY_MAP, { mode: INLINE, sourceId: node.data[CONTROL_KEY_SOURCE_ID], defaultValue: node.data[CONTROL_KEY_MAP] }));
  }

  worker(node, inputs) {
    console.debug('MapLineLayerComponent worker', node, inputs);
    // inputs[INPUT_KEY]=[] // no data
    // inputs[INPUT_KEY]=[[[103.8254528,1.2655414]]]
    const geojson = inputs[INPUT_KEY][0];

    const mapCtrl = this.editor.nodes
      .find((n) => n.id === node.id)
      .controls
      .get(CONTROL_KEY_MAP);

    // const lineCfg = {
    //   lineColor: node.data[CONTROL_KEY_LINE_COLOR],
    //   lineWidth: node.data[CONTROL_KEY_LINE_WIDTH],
    //   colorBaseOnField: node.data[CONTROL_KEY_COLOR_BASE_ON_FIELD],
    // };

    if (!geojson) {
      // no data input, maybe link disconnect
      // this.updateText(node, '');

      // Set empty to map data source, then no data will show on map
      mapCtrl.setEmptyData();
      return;
    }

    mapCtrl.setAllData(geojson);
  }
}
