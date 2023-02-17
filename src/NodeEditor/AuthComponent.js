import Rete from 'rete';
import RequestHeadersControl from './RequestHeadersControl';

const CONTROL_KEY_REQUEST_HEADERS = 'headers';

export default class AuthComponent extends Rete.Component {
  constructor() {
    super('Auth Node'); // node title
  }

  builder(node) {
    return node
      .addControl(new RequestHeadersControl(this.editor, CONTROL_KEY_REQUEST_HEADERS, node));
  }

  worker(node, inputs, outputs) {
    window.NM_REQUEST_HEADERS = node.data[CONTROL_KEY_REQUEST_HEADERS];
  }
}
