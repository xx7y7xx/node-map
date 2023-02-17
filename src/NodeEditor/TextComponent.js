import Rete from 'rete';
import TextControl from './TextControl';

export const textSocket = new Rete.Socket('Text value');

export default class TextComponent extends Rete.Component {
  constructor() {
    super('Text Node'); // node title
  }

  builder(node) {
    const out1 = new Rete.Output('text', 'Text Socket', textSocket);
    const ctrl = new TextControl(this.editor, 'text', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs.text = node.data.text;
  }
}
