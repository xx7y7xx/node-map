import { Control, Node, NodeEditor } from 'rete';
import ColorPicker from './components/ColorPicker';

type ControlInternalProps = {
  value?: string;
  onChange: (value: string) => void;
};

export default class ColorPickerControl extends Control {
  static component = ColorPicker;

  emitter: NodeEditor;
  component: typeof ColorPicker;
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
    this.component = ColorPickerControl.component;

    const initial = (node.data[key] as string) || '#000';

    node.data[key] = initial;
    this.props = {
      ...props,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger('process');
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
