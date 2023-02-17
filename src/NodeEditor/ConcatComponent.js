import Rete from 'rete';
import { objectSocket } from './JsonComponent';
import ButtonControl from './ButtonControl';

export default class ConcatComponent extends Rete.Component {
  constructor() {
    super('Concat');
  }

  builder(node) {
    let index = 0;
    const initCount = node.data.inputCount;
    node.data.inputCount = 0;

    const onClick = () => {
      node.addInput(
        new Rete.Input(`json${index}`, `JSON ${index}`, objectSocket),
      );
      index += 1;
      node.data.inputCount += 1;
      node.update(); // Rerender ConcatComponent
    };

    // Add input
    [...Array(initCount).keys()].forEach(() => {
      node.addInput(new Rete.Input(`json${index}`, `JSON ${index}`, objectSocket));
      index += 1;
      node.data.inputCount += 1;
    });

    return node
      .addOutput(new Rete.Output('json', 'JSON', objectSocket))
      .addControl(
        new ButtonControl(this.editor, 'addInputSocket', {
          text: 'Add Input Socket',
          onClick,
        }),
      );
  }

  worker(node, inputs, outputs) {
    let out = [];

    Object.keys(inputs)
      .filter((key) => inputs[key].length) // filter out input socket which has no data input
      .filter((key) => inputs[key][0]) // when line remove from node, inputs[key]=[undefined]
      .forEach((key) => {
        const inputValue = inputs[key].length ? inputs[key][0] : node.data[key];
        out = [...out, ...inputValue];
      });

    outputs.json = out;
  }
}
