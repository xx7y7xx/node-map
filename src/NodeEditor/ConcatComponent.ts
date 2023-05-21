import Rete, { Component, Node } from 'rete';
import { objectSocket } from './JsonComponent';
import ButtonControl from './ButtonControl';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

const KEY = 'Concat';

export default class ConcatComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    let index = 0;
    const initCount = node.data.inputCount;
    node.data.inputCount = 0;

    const onClick = () => {
      node.addInput(
        new Rete.Input(`json${index}`, `JSON ${index}`, objectSocket),
      );
      index += 1;
      (node.data.inputCount as number) += 1;
      node.update(); // Rerender ConcatComponent
    };

    // Add input
    // @ts-ignore
    [...Array(initCount).keys()].forEach(() => {
      node.addInput(
        new Rete.Input(`json${index}`, `JSON ${index}`, objectSocket),
      );
      index += 1;
      (node.data.inputCount as number) += 1;
    });

    node.addOutput(new Rete.Output('json', 'JSON', objectSocket)).addControl(
      new ButtonControl(this.editor, 'addInputSocket', {
        text: 'Add Input Socket',
        onClick,
      }),
    );
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    let out: any[] = [];

    Object.keys(inputs)
      .filter((key) => inputs[key].length) // filter out input socket which has no data input
      .filter((key) => inputs[key][0]) // when line remove from node, inputs[key]=[undefined]
      .forEach((key) => {
        const inputValue = inputs[key].length ? inputs[key][0] : node.data[key];
        out = [...out, ...(inputValue as any)];
      });

    outputs.json = out;
  }
}
