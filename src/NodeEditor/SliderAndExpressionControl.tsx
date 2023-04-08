import { Control, Node, NodeEditor } from 'rete';
import SliderAndExpressionField from './components/SliderAndExpressionField';

type ControlInternalProps = {
  value: number;
  defaultValue: number;
  onChange: (value: number) => void;
};

export default class SliderAndExpressionControl extends Control {
  static component = SliderAndExpressionField;

  emitter: NodeEditor | null;
  component: typeof SliderAndExpressionField;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(
    emitter: NodeEditor,
    key: string,
    node: Node,
    props: { defaultValue: number },
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SliderAndExpressionControl.component;

    let initial = 1;
    if (node.data[key]) {
      initial = node.data[key] as number;
    } else if (props.defaultValue) {
      initial = props.defaultValue;
    }

    node.data[key] = initial;
    this.props = {
      ...props,
      value: initial,
      defaultValue: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter?.trigger('process');
      },
    };
  }

  setValue(val: number) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}
