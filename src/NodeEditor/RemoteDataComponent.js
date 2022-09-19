import Rete from 'rete';
import RemoteDataControl from './RemoteDataControl';
import InputControl from './InputControl';
import DivControl from './DivControl';
import { objectSocket } from './JsonComponent';

const CONTROL_KEY_URL = 'inputControlUrl';
const CONTROL_KEY = 'remoteDataControl';
const CONTROL_KEY_JWT = 'inputControlJwt';
const CONTROL_KEY_X_AUTH_METHOD = 'inputControlXAuthMethod';
const OUTPUT_KEY = 'csv';

export default class RemoteDataComponent extends Rete.Component {
  constructor() {
    super('RemoteData'); // node title
  }

  builder(node) {
    node
      .addControl(new InputControl(this.editor, CONTROL_KEY_URL, node, { label: 'url' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_JWT, node, { label: 'headers.authorization' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_X_AUTH_METHOD, node, { label: 'headers.x-auth-method' }))
      .addControl(new RemoteDataControl(this.editor, CONTROL_KEY, node))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'JSON', objectSocket));
    if (node.data[CONTROL_KEY]) {
      node
        .addControl(new DivControl('title', 'cached data'));
    }
    return node;
  }

  // eslint-disable-next-line class-methods-use-this
  worker(node, inputs, outputs) {
    // eslint-disable-next-line no-param-reassign
    outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];
  }
}
