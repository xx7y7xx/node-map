import { Control, Node, NodeEditor } from 'rete';
import NumberSlider from './components/NumberSlider';

type ControlProps = {
  label: string;
  defaultValue?: number;
};
type ControlInternalProps = {
  value: number;
  onChange: (value: number) => void;
};

export default class SliderControl extends Control {
  static component = NumberSlider;

  emitter: NodeEditor | null;
  component: typeof NumberSlider;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(
    emitter: NodeEditor | null,
    key: string,
    node: Node,
    props: ControlProps = { label: '' },
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SliderControl.component;

    const initial = (node.data[key] as number) || props.defaultValue || 1;

    node.data[key] = initial;
    this.props = {
      ...props,
      value: initial,
      onChange: (v: number) => {
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
