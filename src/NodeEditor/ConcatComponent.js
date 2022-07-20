import Rete from 'rete';
import { jsonSocket } from './JsonComponent';
import ButtonControl from './ButtonControl';

export default class ConcatComponent extends Rete.Component {
  constructor() {
    super('Concat');
  }

  builder(node) {
    let index = 0;

    const onClick = () => {
      node.addInput(
        new Rete.Input(`json${index}`, `Json ${index}`, jsonSocket),
      );
      index += 1;
      node.update(); // Rerender ConcatComponent
    };

    // Add input
    [...Array(node.inputs.size).keys()].forEach(() => {
      node.addInput(new Rete.Input(`json${index}`, `Json ${index}`, jsonSocket));
      index += 1;
    });

    return node
      .addOutput(new Rete.Output('json', 'Json', jsonSocket))
      .addControl(
        new ButtonControl(this.editor, 'addInputSocket', {
          text: 'Add Input Socket',
          onClick,
        }),
      );
  }

  // eslint-disable-next-line class-methods-use-this
  worker(node, inputs, outputs) {
    let out = [];

    Object.keys(inputs)
      .filter((key) => inputs[key].length) // filter out input socket which has no data input
      .filter((key) => inputs[key][0]) // when line remove from node, inputs[key]=[undefined]
      .forEach((key) => {
        const inputValue = inputs[key].length ? inputs[key][0] : node.data[key];
        out = [...out, ...inputValue];
      });

    // eslint-disable-next-line no-param-reassign
    outputs.json = out;
  }
}
