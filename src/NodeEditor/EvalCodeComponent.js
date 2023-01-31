import Rete from 'rete';

import { objectSocket } from './JsonComponent';
import CodeBoxControl from './CodeBoxControl';
import DivControl from './DivControl';
import FaqControl from './FaqControl';
import logger from './logger';

const CONTROL_KEY_FAQ = 'controlKeyFaq';
const CONTROL_KEY_CODE_BOX = 'controlKeyCodeBox';
const log = logger('EvalCodeComponent');

export default class EvalCodeComponent extends Rete.Component {
  constructor() {
    super('EvalCode Node');
  }

  builder(node) {
    log('build', node.id);

    const input = new Rete.Input('json', 'Json', objectSocket);
    const output = new Rete.Output('json', 'Json', objectSocket);

    return node
      .addInput(input)
      .addOutput(output)
      .addControl(new FaqControl(this.editor, CONTROL_KEY_FAQ, node, {
        path: 'EvalCodeFaq',
      }))
      .addControl(new DivControl(`evalScriptLabel[node${node.id}]`, `Eval Script(node:${node.id}): Please use variable "input".`))
      .addControl(new CodeBoxControl(
        this.editor,
        CONTROL_KEY_CODE_BOX,
        node,
      ));
  }

  /**
   *
   * @param {import('rete/types/core/data').NodeData} nodeData
   * @param {*} inputData
   * @param {*} outputData
   */
  async worker(nodeData, inputData, outputData) {
    log('worker', nodeData);

    let inputJson;
    if (inputData.json.length === 0) {
      // there is no input
      inputJson = undefined;
      // return;
    } else {
      [inputJson] = inputData.json;
    }

    // Run codes with global functions and vars
    // Because the "Global Node" may run after other nodes since in Rete.js nodes run follow the node ID.
    // So run the code in "Global Node" before running the code in current node.
    const globalControl = this.editor.nodes.find((n) => n.name === 'Global Node').controls.get(CONTROL_KEY_CODE_BOX);
    await globalControl.runCode(inputJson);

    const { controls } = this.editor.nodes.find((n) => n.id === nodeData.id);
    const result = await controls.get(CONTROL_KEY_CODE_BOX).runCode(inputJson);

    // eslint-disable-next-line no-param-reassign
    outputData.json = result;
  }
}
