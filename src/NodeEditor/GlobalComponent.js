import Rete from 'rete';

import EvalCodeControl from './EvalCodeControl';
import DivControl from './DivControl';
import FaqControl from './FaqControl';
import logger from './logger';
import faq from './EvalCodeFaq.md';

const CONTROL_KEY_FAQ = 'controlKeyFaq';
const CONTROL_KEY_CODE_BOX = 'controlKeyCodeBox';
const log = logger('GlobalComponent');

export default class GlobalComponent extends Rete.Component {
  constructor() {
    super('Global Node');
  }

  builder(node) {
    return node
      .addControl(new FaqControl(this.editor, CONTROL_KEY_FAQ, node, {
        content: faq,
      }))
      .addControl(new DivControl(`evalScriptLabel[node${node.id}]`, `Eval Script(node:${node.id}).`))
      .addControl(new EvalCodeControl(
        this.editor,
        CONTROL_KEY_CODE_BOX,
        node,
      ));
  }

  /**
   *
   * @param {import('rete/types/core/data').NodeData} nodeData
   */
  async worker(nodeData) {
    log('worker', nodeData);

    const { controls } = this.editor.nodes.find((n) => n.id === nodeData.id);
    await controls.get(CONTROL_KEY_CODE_BOX).runCode();
  }
}
