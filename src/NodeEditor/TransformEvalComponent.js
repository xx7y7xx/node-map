import Rete from 'rete';
import { jsonSocket } from './JsonComponent';
import TextAreaControl from './TextAreaControl';
import DivControl from './DivControl';

const log = (...args) => {
  console.debug('TransformEvalComponent', ...args);
};
export default class TransformEvalComponent extends Rete.Component {
  constructor() {
    super('Transform Eval');

    // Store all nodes ref related to this component
    // May use node ref later to add control
    this.nodes = {
      // [node.id]: node
    };

    this.errorMessageControls = {
      // [node.id]: node
    };
  }

  builder(node) {
    log('build', node.id);
    this.nodes[node.id] = node;

    const input = new Rete.Input('json', 'Json', jsonSocket);
    const output = new Rete.Output('json', 'Json', jsonSocket);

    return node
      .addInput(input)
      .addOutput(output)
      .addControl(new DivControl(`evalScriptLabel[node${node.id}]`, `Eval Script(node:${node.id})`))
      .addControl(new TextAreaControl(this.editor, 'fnStr', node, { cols: 40 }));
  }

  worker(nodeData, inputs, outputs) {
    log('worker', nodeData);

    if (inputs.json.length === 0) {
      // there is no input
      return;
    }

    const jsonNodeValue = inputs.json[0];

    if (!jsonNodeValue.data) {
      // eslint-disable-next-line no-param-reassign
      outputs.json = [];
      return;
    }

    const { controls } = this.editor.nodes.find((n) => n.id === nodeData.id);
    const fnStr = controls.get('fnStr').getValue();

    try {
      // eslint-disable-next-line no-new-func
      const fn = Function('input', fnStr);

      // eslint-disable-next-line no-param-reassign
      outputs.json = fn(jsonNodeValue);
      if (this.errorMessageControls[nodeData.id]) {
        console.debug('Remove control');
        this.hideError(nodeData.id);
      }
    } catch (err) {
      console.error('Failed to eval function!', err);

      this.showError(nodeData.id, err);
    }
  }

  showError(nodeId, err) {
    console.debug('Add control', this.nodes[nodeId]);

    const controlKey = `evalScriptErrorMessage[node${nodeId}]`;
    const node = this.nodes[nodeId];

    if (node.controls.has(controlKey)) {
      // Control already exists
      return;
    }

    this.errorMessageControls[nodeId] = new DivControl(controlKey, `Failed to eval: ${err.message}`);
    node
      .addControl(this.errorMessageControls[nodeId])
      .update(); // Rerender this component
  }

  hideError(nodeId) {
    this.nodes[nodeId]
      .removeControl(this.errorMessageControls[nodeId])
      .update(); // Rerender this component
    this.errorMessageControls[nodeId] = null;
  }
}
