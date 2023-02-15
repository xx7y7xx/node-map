import Rete from 'rete';
import JsonControl from './JsonControl';

export const objectSocket = new Rete.Socket('Object value');

export const OUTPUT_KEY = 'json1';
export const CONTROL_KEY = 'json2';

export default class JsonComponent extends Rete.Component {
  constructor() {
    super('JSON'); // node title
  }

  builder(node) {
    return node
      .addControl(new JsonControl(this.editor, CONTROL_KEY, node))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'JSON', objectSocket));
  }

  // eslint-disable-next-line class-methods-use-this
  worker(node, inputs, outputs) {
    // `node.data` is `{}` (empty object) when node just created on board
    if (!node.data[CONTROL_KEY]) return;

    // eslint-disable-next-line no-param-reassign
    outputs[OUTPUT_KEY] = node.data[CONTROL_KEY].obj; // obj could be null
  }
}

// Mock data
/*
## Input has 1 Point Feature
[
  [103.704541,1.3397443]
]

## Input has 2 Point Feature and 1 LineString Feature
[
  [103.8254528,1.2655414],
  [103.704541,1.3397443],
  [
    [103.8254528,1.2655414],
    [103.704541,1.3397443],
    [103.794541,1.3997443],
    [103.854541,1.3297443]
  ]
]
*/
