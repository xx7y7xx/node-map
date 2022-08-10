import Rete from 'rete';
import RemoteDataControl from './RemoteDataControl';
import { stringSocket } from './UploadCsvComponent';

const CONTROL_KEY = 'remoteDataControl';
const OUTPUT_KEY = 'csv';

export default class RemoteDataComponent extends Rete.Component {
  constructor() {
    super('Remote Data Node'); // node title
  }

  builder(node) {
    return node
      .addControl(new RemoteDataControl(this.editor, CONTROL_KEY, node))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'String Socket', stringSocket));
  }

  // eslint-disable-next-line class-methods-use-this
  worker(node, inputs, outputs) {
    // eslint-disable-next-line no-param-reassign
    outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];
  }
}
