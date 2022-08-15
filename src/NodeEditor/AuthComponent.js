import Rete from 'rete';
import InputControl from './InputControl';

const CONTROL_KEY_JWT = 'inputControlJwt';
const CONTROL_KEY_X_AUTH_METHOD = 'inputControlXAuthMethod';

export default class AuthComponent extends Rete.Component {
  constructor() {
    super('Auth Node'); // node title
  }

  builder(node) {
    return node
      .addControl(new InputControl(this.editor, CONTROL_KEY_JWT, node, { label: 'jwt' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_X_AUTH_METHOD, node, { label: 'x-auth-method' }));
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  worker(node, inputs, outputs) {
    // eslint-disable-next-line no-param-reassign
    // outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];
    window.NM_JWT = node.data[CONTROL_KEY_JWT];
    window.NM_X_AUTH_METHOD = node.data[CONTROL_KEY_X_AUTH_METHOD];
  }
}
