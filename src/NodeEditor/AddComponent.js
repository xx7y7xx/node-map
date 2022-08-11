import Rete from 'rete';
import MyNode from './MyNode';
import NumControl from './NumControl';
import TextControl from './TextControl';
import { numSocket } from './NumComponent';
import { textSocket } from './TextComponent';
import { jsonSocket } from './JsonComponent';
import JsonControl from './JsonControl';

export default class AddComponent extends Rete.Component {
  constructor() {
    super('Add');
    this.data.component = MyNode; // optional
  }

  builder(node) {
    const inp1 = new Rete.Input('num1', 'Number Socket', numSocket);
    const inp2 = new Rete.Input('num2', 'Number Socket 2', numSocket);
    const inp3 = new Rete.Input('text1', 'Text Socket', textSocket);
    const inp4 = new Rete.Input('json1', 'JSON Socket', jsonSocket);
    const out = new Rete.Output('num', 'Number', numSocket);

    inp1.addControl(new NumControl(this.editor, 'num1', node));
    inp2.addControl(new NumControl(this.editor, 'num2', node));
    inp3.addControl(new TextControl(this.editor, 'text1', node));
    inp4.addControl(new JsonControl(this.editor, 'text1', node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addInput(inp4)
      .addControl(new TextControl(this.editor, 'preview', node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs.num1.length ? inputs.num1[0] : node.data.num1;
    const n2 = inputs.num2.length ? inputs.num2[0] : node.data.num2;
    const n3 = inputs.text1.length ? inputs.text1[0] : node.data.text1;
    const n4 = inputs.json1.length ? inputs.json1[0] : node.data.json1;
    const sum = n1 + n2;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get('preview')
      .setValue(`${sum}|${n3}|${n4}`);
    outputs.num = sum; // eslint-disable-line no-param-reassign
  }
}
