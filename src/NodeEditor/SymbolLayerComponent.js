import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';
import SelectControl from './SelectControl';
import InputControl from './InputControl';

const INPUT_KEY = 'sourceId';
const CONTROL_KEY_TEXT_COLOR = 'textColor';
const CONTROL_KEY_TEXT_SIZE = 'textSize';
const CONTROL_KEY_TEXT_FONT = 'textFont';
const CONTROL_KEY_TEXT_FIELD = 'textField';

const KEY = 'SymbolLayer';

const defaultTextFont = ['Open Sans Regular', 'Arial Unicode MS Regular'];

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
 */
export default class SymbolLayerComponent extends Rete.Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  static inputKey = INPUT_KEY;

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    return node
      .addInput(input)
      // paint
      .addControl(new ColorPickerControl(this.editor, CONTROL_KEY_TEXT_COLOR, node, { label: 'text-color' }))
      // layout
      .addControl(new SliderControl(this.editor, CONTROL_KEY_TEXT_SIZE, node, { label: 'text-size' }))
      .addControl(new SelectControl(this.editor, CONTROL_KEY_TEXT_FONT, node, { label: 'text-font', mode: 'multiple', options: defaultTextFont.map((item) => ({ value: item, label: item })) }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_TEXT_FIELD, node, { label: 'text-field' }));
  }

  worker(node, inputs) {
    console.debug('SymbolLayerComponent worker', node, inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const layerIdSymbol = `${sourceId}LayerIdSymbol`;

    if (!sourceId) {
      console.debug('SymbolLayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerIdSymbol)) {
        console.debug('SymbolLayerComponent remove layer', layerIdSymbol);
        map.removeLayer(layerIdSymbol);
      }
      return;
    }
    console.debug('SymbolLayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const layerIdSymbol = `${sourceId}LayerIdSymbol`;

    if (map.getLayer(layerIdSymbol)) {
      console.debug('SymbolLayerComponent layer exists', layerIdSymbol);
      map.setPaintProperty(layerIdSymbol, 'text-color', node.data[CONTROL_KEY_TEXT_COLOR]);
      map.setLayoutProperty(layerIdSymbol, 'text-size', node.data[CONTROL_KEY_TEXT_SIZE]);
      map.setLayoutProperty(layerIdSymbol, 'text-font', node.data[CONTROL_KEY_TEXT_FONT]);
      map.setLayoutProperty(layerIdSymbol, 'text-field', this.convertTextField(node));
    } else {
      console.debug('SymbolLayerComponent layer doesnt exist', layerIdSymbol);
      window.mapbox.addLayer({
        id: layerIdSymbol,
        type: 'symbol',
        source: sourceId,
        paint: {
          'text-color': node.data[CONTROL_KEY_TEXT_COLOR],
        },
        layout: {
          'text-size': node.data[CONTROL_KEY_TEXT_SIZE],
          'text-font': node.data[CONTROL_KEY_TEXT_FONT], // ['Noto Sans Regular']
          'text-field': this.convertTextField(node), // ['get', 'point_count_abbreviated']
        },
      });
    }
  }

  convertTextField(node) {
    const inputBoxStr = node.data[CONTROL_KEY_TEXT_FIELD];
    if (!inputBoxStr.startsWith('[')) {
      return node.data[CONTROL_KEY_TEXT_FIELD];
    }
    return JSON.parse(node.data[CONTROL_KEY_TEXT_FIELD]);
  }
}
