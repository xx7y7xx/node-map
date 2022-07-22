/* eslint-disable class-methods-use-this */

import Rete from 'rete';
import Papa from 'papaparse';

import { jsonSocket } from './JsonComponent';
import DivControl from './DivControl';
import { stringSocket } from './UploadCsvComponent';

export default class CsvToJsonComponent extends Rete.Component {
  constructor() {
    super('CSV to JSON');
  }

  builder(node) {
    const input = new Rete.Input('csv', 'CSV', stringSocket);
    const output = new Rete.Output('json', 'JSON', jsonSocket);

    return node
      .addInput(input)
      .addOutput(output)
      .addControl(new DivControl('title', 'CSV to JSON'));
  }

  worker(nodeData, inputs, outputs) {
    if (inputs.csv.length === 0) {
      // there is no input
      return;
    }

    const csvStr = inputs.csv[0];

    if (!csvStr) {
      // eslint-disable-next-line no-param-reassign
      outputs.json = [];
      return;
    }

    const result = Papa.parse(csvStr, {
      header: true,
      dynamicTyping: true,
    });

    // eslint-disable-next-line no-param-reassign
    outputs.json = result.data;
  }
}
