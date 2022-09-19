import Rete from 'rete';
import * as turf from '@turf/turf';

import { objectSocket } from './JsonComponent';

const OUTPUT_KEY = 'geoJson';
const INPUT_KEY = 'coordinatesArray';

export default class TurfLineStringComponent extends Rete.Component {
  constructor() {
    super('Turf LineString Node');
  }

  // eslint-disable-next-line class-methods-use-this
  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'coordinatesArray', objectSocket);
    const output = new Rete.Output(OUTPUT_KEY, 'GeoJSON', objectSocket);

    return node
      .addInput(input)
      .addOutput(output);
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs, outputs) {
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    const coordinatesArray = inputs[INPUT_KEY][0];

    if (!coordinatesArray) {
      // no data input, maybe link disconnect
      this.updateText(node, '');
      return;
    }

    // eslint-disable-next-line no-param-reassign
    outputs[OUTPUT_KEY] = turf.lineString(coordinatesArray);
  }
}