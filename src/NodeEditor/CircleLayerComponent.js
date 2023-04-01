import Rete from 'rete';

import { stringSocket } from './UploadCsvComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';
import InputNumberControl from './InputNumberControl';

const INPUT_KEY = 'sourceId';
const CONTROL_KEY = 'circleColor';
const CONTROL_KEY_CIRCLE_RADIUS = 'circleRadius';

const KEY = 'CircleLayer';

/**
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
 */
export default class CircleLayerComponent extends Rete.Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  static inputKey = INPUT_KEY;

  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'sourceId', stringSocket);

    return node
      .addInput(input)
      .addControl(new ColorPickerControl(this.editor, CONTROL_KEY, node, { label: 'color' }))
      .addControl(new SliderControl(this.editor, CONTROL_KEY_CIRCLE_RADIUS, node, { label: 'circle-radius' }))
      .addControl(new InputNumberControl(this.editor, 'circleStrokeWidth', node, { label: 'circle-stroke-width' }))
      .addControl(new ColorPickerControl(this.editor, 'circleStrokeColor', node, { label: 'circle-stroke-color' }));
  }

  worker(node, inputs) {
    console.debug('CircleLayerComponent worker', node, inputs);
    const sourceId = inputs[INPUT_KEY][0];
    const layerId = `${sourceId}LayerIdCircle`;

    if (!sourceId) {
      console.debug('CircleLayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        console.debug('CircleLayerComponent remove layer', layerId);
        map.removeLayer(layerId);
      }
      return;
    }
    console.debug('CircleLayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const layerId = `${sourceId}LayerIdCircle`;

    if (map.getLayer(layerId)) {
      console.debug('CircleLayerComponent layer exists', layerId);
      map.setPaintProperty(layerId, 'circle-color', node.data[CONTROL_KEY]);
      map.setPaintProperty(layerId, 'circle-radius', node.data[CONTROL_KEY_CIRCLE_RADIUS]);
      map.setPaintProperty(layerId, 'circle-stroke-width', node.data.circleStrokeWidth);
      map.setPaintProperty(layerId, 'circle-stroke-color', node.data.circleStrokeColor);
    } else {
      console.debug('CircleLayerComponent layer doesnt exist', layerId);
      window.mapbox.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': node.data[CONTROL_KEY_CIRCLE_RADIUS],
          'circle-color': node.data[CONTROL_KEY],
          'circle-stroke-width': node.data.circleStrokeWidth,
          'circle-stroke-color': node.data.circleStrokeColor,
        },
      });
    }
  }
}
