import Rete, { Component, Node } from 'rete';
import UploadControl from './UploadControl';
import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

const KEY = 'Upload Node';

export default class UploadComponent extends Component {
  constructor() {
    super(KEY); // node title
  }

  static key = KEY;

  async builder(node: Node) {
    node
      .addControl(new UploadControl(this.editor, 'upload'))
      .addOutput(new Rete.Output('json', 'JSON Socket', objectSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    if (typeof node.data.upload === 'string') {
      outputs.json = JSON.parse(node.data.upload);
    } else {
      outputs.json = node.data.upload;
    }
  }
}
