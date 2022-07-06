import Rete from 'rete';
import { jsonSocket } from './JsonComponent';
import TextAreaControl from './TextAreaControl';
import DivControl from './DivControl';

export default class TransformEvalComponent extends Rete.Component {
  constructor() {
    super('Transform Eval');
  }

  builder(node) {
    const input = new Rete.Input('json', 'Json', jsonSocket);
    const output = new Rete.Output('json', 'Json', jsonSocket);

    return node
      .addInput(input)
      .addOutput(output)
      .addControl(new DivControl('evalScriptLabel', 'Eval Script'))
      .addControl(new TextAreaControl(this.editor, 'fnStr', node, { cols: 40 }));
  }

  worker(node, inputs, outputs) {
    const jsonNodeValue = inputs.json.length ? inputs.json[0] : node.data.json;

    if (!jsonNodeValue.data) {
      // eslint-disable-next-line no-param-reassign
      outputs.json = [];
      return;
    }

    const { controls } = this.editor.nodes.find((n) => n.id === node.id);
    const fnStr = controls.get('fnStr').getValue();

    const fn = Function('input', fnStr); // eslint-disable-line no-new-func

    // eslint-disable-next-line no-param-reassign
    outputs.json = fn(jsonNodeValue);
  }
}
