import _ from 'lodash';
import Rete from 'rete';
import { objectSocket } from './JsonComponent';
import InputControl from './InputControl';
import DivControl from './DivControl';

export default class TransformComponent extends Rete.Component {
  constructor() {
    super('Transform');
  }

  builder(node) {
    const input = new Rete.Input('json', 'Json', objectSocket);
    const output = new Rete.Output('json', 'Json', objectSocket);

    return node
      .addInput(input)
      .addOutput(output)
      .addControl(new DivControl('latKeyLabel', 'Lat Key'))
      .addControl(new InputControl(this.editor, 'latKey', node, true))
      .addControl(new DivControl('lngKeyLabel', 'Lng Key'))
      .addControl(new InputControl(this.editor, 'lngKey', node, true));
  }

  worker(node, inputs, outputs) {
    const jsonNodeValue = inputs.json.length ? inputs.json[0] : node.data.json;

    if (!jsonNodeValue) {
      console.debug('[TransformComponent] No input!');
      return;
    }

    const { controls } = this.editor.nodes.find((n) => n.id === node.id);
    const latKey = controls.get('latKey').getValue();
    const lngKey = controls.get('lngKey').getValue();

    // eslint-disable-next-line no-param-reassign
    outputs.json = jsonNodeValue.data
      .filter((item) => _.get(item, `point.${lngKey}`) && _.get(item, `point.${latKey}`))
      .map((item) => (
        [_.get(item, `point.${lngKey}`), _.get(item, `point.${latKey}`)]
      ));
  }
}
