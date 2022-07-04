import Rete from 'rete';
import NumControl from './NumControl';

export const numSocket = new Rete.Socket('Number value');

export default class NumComponent extends Rete.Component {
  constructor() {
    super('Number');
  }

  builder(node) {
    const out1 = new Rete.Output('num', 'Number', numSocket);
    const ctrl = new NumControl(this.editor, 'num', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) { // eslint-disable-line class-methods-use-this
    outputs.num = node.data.num; // eslint-disable-line no-param-reassign
  }
}
