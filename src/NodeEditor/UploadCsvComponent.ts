import Rete, { Component, Node } from 'rete';
import UploadControl from './UploadControl';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

export const stringSocket = new Rete.Socket('String value');
const OUTPUT_KEY = 'csv';

export default class UploadCsvComponent extends Component {
  constructor() {
    super('Upload CSV Node'); // node title
  }

  async builder(node: Node) {
    node
      .addControl(new UploadControl(this.editor, 'upload'))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'CSV Socket', stringSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    outputs[OUTPUT_KEY] = node.data.upload;
  }
}
