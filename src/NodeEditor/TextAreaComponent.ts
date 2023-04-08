// @ts-nocheck

import Rete from 'rete';
import TextAreaControl from './TextAreaControl';

export const textSocket = new Rete.Socket('Text value');

export default class TextAreaComponent extends Rete.Component {
  constructor() {
    super('Text Node'); // node title
  }

  builder(node) {
    const out1 = new Rete.Output('text', 'Text Socket', textSocket);
    const ctrl = new TextAreaControl(this.editor, 'text', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs.text = node.data.text;
  }
}
