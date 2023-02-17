import Rete from 'rete';
import UploadControl from './UploadControl';
import { objectSocket } from './JsonComponent';

export default class UploadComponent extends Rete.Component {
  constructor() {
    super('Upload Node'); // node title
  }

  builder(node) {
    return node
      .addControl(new UploadControl(this.editor, 'upload', node))
      .addOutput(new Rete.Output('json', 'JSON Socket', objectSocket));
  }

  worker(node, inputs, outputs) {
    if (typeof node.data.upload === 'string') {
      outputs.json = JSON.parse(node.data.upload);
    } else {
      outputs.json = node.data.upload;
    }
  }
}
