import Rete from 'rete';
import ColorPickerAndExpressionField from './components/ColorPicker/ColorPickerAndExpressionField';

export default class ColorPickerAndExpressionControl extends Rete.Control {
  static component = ColorPickerAndExpressionField;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = ColorPickerAndExpressionControl.component;

    let initial = '#000';
    if (node.data[key]) {
      initial = node.data[key];
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
        this.emitter.trigger('process');
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}
