import Rete, { Node, Component } from 'rete';

import { objectSocket } from './JsonComponent';
// import ColorPickerControl from './ColorPickerControl';
// import SliderControl from './SliderControl';
import InputControl from './InputControl';
import MapControl from './MapControl';
import { genSourceId } from './helpers';
import { NodeData, WorkerInputs } from 'rete/types/core/data';
import { FeatureCollection } from 'geojson';

// const LAYER_ID = 'nm-line-string-layer';
// const LAYER_ID_POINT = 'nm-point-layer';
export const INPUT_KEY = 'geojson';
// const CONTROL_KEY_LINE_COLOR = 'controlKeyLineColor';
// const CONTROL_KEY_LINE_WIDTH = 'controlKeyLineWidth';
// const CONTROL_KEY_COLOR_BASE_ON_FIELD = 'controlKeyColorBaseOnField';
// const CONTROL_KEY_GEOJSON = 'controlKeyGeojson';
const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';
const CONTROL_KEY_MAP = 'controlKeyMap';

const KEY = 'Map Source And Layer';

/**
 * DEPRECATED - https://docs.google.com/document/d/1B2U0rhs68pzb5RwncYiNAriuFrRGE4rAgbuaMEobt60/edit#heading=h.7kgmuuq6f6h2
 *
 * This node includes both map source and map layer
 * MapSourceAndLayerComponent = GeoJSONSourceComponent + LineLayerComponent
 *
 * Show all the input controls and other controls on the right side Drawer component
 * The data stored in this node:
 * ```json
 * {
 *   "controlKeyMap": {
 *     "lineColor": "#000",
 *     "lineWidth": 1,
 *     "colorBaseOnField": ""
 *   }
 * }
 * ```
 */
export default class MapSourceAndLayerComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  async builder(node: Node) {
    if (!this.editor) {
      console.error('[NM] FATAL: editor is invalid!');
      return;
    }

    const input = new Rete.Input(INPUT_KEY, 'JSON', objectSocket);

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
      .addControl(
        new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, {
          label: 'sourceId',
          visible: false,
        }),
      )
      .addControl(
        new MapControl(this.editor, CONTROL_KEY_MAP, {
          sourceId: node.data[CONTROL_KEY_SOURCE_ID] as string,
          defaultValue: node.data[CONTROL_KEY_MAP],
        }),
      );
  }

  worker(node: NodeData, inputs: WorkerInputs) {
    console.debug('MapSourceAndLayerComponent worker', node, inputs);
    // inputs[INPUT_KEY]=[] // no data
    // inputs[INPUT_KEY]=[[[103.8254528,1.2655414]]]
    const geojson = inputs[INPUT_KEY][0] as FeatureCollection;

    const mapCtrl = this.editor?.nodes
      .find((n) => n.id === node.id)
      ?.controls.get(CONTROL_KEY_MAP) as MapControl;

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
