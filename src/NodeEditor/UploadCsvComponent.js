import Rete from 'rete';
import UploadControl from './UploadControl';

export const stringSocket = new Rete.Socket('String value');
const OUTPUT_KEY = 'csv';

export default class UploadCsvComponent extends Rete.Component {
  constructor() {
    super('Upload CSV Node'); // node title
  }

  builder(node) {
    return node
      .addControl(new UploadControl(this.editor, 'upload', node))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'CSV Socket', stringSocket));
  }

  // eslint-disable-next-line class-methods-use-this
  worker(node, inputs, outputs) {
    // eslint-disable-next-line no-param-reassign
    outputs[OUTPUT_KEY] = node.data.upload;
  }
}