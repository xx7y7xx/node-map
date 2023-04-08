import { Control, Node, NodeEditor } from 'rete';
import InputField from './components/InputField';

type ControlInternalProps = {
  value: string;
  onChange: (value: string) => void;
};

export default class InputControl extends Control {
  static component = InputField;

  emitter: NodeEditor | null;
  component: typeof InputField;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(emitter: NodeEditor | null, key: string, node: Node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = InputControl.component;

    const initial = (node.data[key] as string) || '';

    node.data[key] = initial;
    this.props = {
      ...props,
      value: initial,
      onChange: (v: string) => {
        this.setValue(v);
        this.emitter?.trigger('process');
      },
    };
  }

  setValue(val: string) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}
