import Rete, { Component, Node } from 'rete';
import JsonEditorControl from './JsonEditorControl';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

/**
 * This type in Javascript can be:
 * - string: JSON.parse("abc")
 * - number: JSON.parse(123)
 * - boolean: JSON.parse(true)
 * - null: JSON.parse(null)
 * - object: JSON.parse("[1,2,3]")
 * So it's a dynamic type
 */
export const objectSocket = new Rete.Socket('Object value');

export const KEY = 'JSON';
export const OUTPUT_KEY = 'json1';
export const CONTROL_KEY = 'json2';

/**
 * Write JSON in textbox, then output to be used in next node
 * Store data:
 * ```json
 * {
 *   "json2": {
 *     "obj": {"foo":"bar"}
 *     "text": "{\"foo\":\"bar\"}"
 *   }
 * }
 * ```
 */
export default class JsonComponent extends Component {
  constructor() {
    super(KEY); // node title
  }

  static key = KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }
    node
      .addControl(new JsonEditorControl(this.editor, CONTROL_KEY, node))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'JSON', objectSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    // `node.data` is `{}` (empty object) when node just created on board
    if (!node.data[CONTROL_KEY]) return;

    outputs[OUTPUT_KEY] = (node.data[CONTROL_KEY] as any).obj; // obj could be null
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
