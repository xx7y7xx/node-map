import Rete from 'rete';
import JsonControl from './JsonControl';

export const jsonSocket = new Rete.Socket('Json value');

export default class JsonComponent extends Rete.Component {
  constructor() {
    super('Json Node'); // node title
  }

  builder(node) {
    return node
      .addControl(new JsonControl(this.editor, 'json', node))
      .addOutput(new Rete.Output('json', 'Json Socket', jsonSocket));
  }

  // eslint-disable-next-line class-methods-use-this
  worker(node, inputs, outputs) {
    outputs.json = node.data.json; // eslint-disable-line no-param-reassign
  }
}
