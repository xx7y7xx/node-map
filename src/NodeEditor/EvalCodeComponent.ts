import Rete, { Node, Component } from 'rete';

import { objectSocket } from './JsonComponent';
import EvalCodeControl from './EvalCodeControl';
// import DivControl from './DivControl';
// import FaqControl from './FaqControl';
import logger from './logger';
// import faq from './EvalCodeFaq.md';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

const KEY = 'EvalCode';

// const CONTROL_KEY_FAQ = 'controlKeyFaq';
const CONTROL_KEY_CODE_BOX = 'controlKeyCodeBox';
const log = logger('EvalCodeComponent');

export default class EvalCodeComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }

    const input = new Rete.Input('json', 'Json', objectSocket);
    const output = new Rete.Output('json', 'Json', objectSocket);

    node
      .addInput(input)
      .addOutput(output)
      // .addControl(
      //   new FaqControl(this.editor, CONTROL_KEY_FAQ, node, {
      //     content: faq,
      //   }),
      // )
      // .addControl(
      //   new DivControl(
      //     `evalScriptLabel[node${node.id}]`,
      //     `Eval Script(node:${node.id})`,
      //   ),
      // )
      .addControl(new EvalCodeControl(this.editor, CONTROL_KEY_CODE_BOX, node));
  }

  /**
   *
   * @param {import('rete/types/core/data').NodeData} nodeData
   * @param {*} inputData
   * @param {*} outputData
   */
  async worker(
    nodeData: NodeData,
    inputData: WorkerInputs,
    outputData: WorkerOutputs,
  ) {
    log('worker', nodeData);

    let inputJson: string;
    if (inputData.json.length === 0) {
      // there is no input
      inputJson = '';
      // return;
    } else {
      [inputJson] = inputData.json as string[];
    }

    // Run codes with global functions and vars
    // Because the "Global Node" may run after other nodes since in Rete.js nodes run follow the node ID.
    // So run the code in "Global Node" before running the code in current node.
    const globalControl = this.editor?.nodes
      .find((n) => n.name === 'Global Node')
      ?.controls.get(CONTROL_KEY_CODE_BOX) as EvalCodeControl;
    if (globalControl) {
      await globalControl.runCode(inputJson);
    }

    const controls = this.editor?.nodes.find(
      (n) => n.id === nodeData.id,
    )?.controls;
    if (controls) {
      const control = controls.get(CONTROL_KEY_CODE_BOX) as EvalCodeControl;
      const result = await control.runCode(inputJson);
      outputData.json = result;
    }
  }
}
