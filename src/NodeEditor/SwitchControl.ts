import { Control, Node, NodeEditor } from 'rete';
import SwitchField from './components/SwitchField';

type ControlInternalProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default class SwitchControl extends Control {
  static component = SwitchField;

  emitter: NodeEditor;
  component: typeof SwitchField;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(emitter: NodeEditor, key: string, node: Node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SwitchControl.component;

    let initial = false;
    if (node.data[key] !== undefined) {
      initial = node.data[key] as boolean;
    }
    node.data[key] = initial;

    this.props = {
      ...props,
      checked: initial,
      onChange: (v) => {
        this.setChecked(v);
        this.emitter.trigger('process');
      },
    };
  }

  setChecked(checked: boolean) {
    this.props.checked = checked;
    this.putData(this.key, checked);
    this.update();
  }

  getChecked() {
    return this.props.checked;
  }
}
