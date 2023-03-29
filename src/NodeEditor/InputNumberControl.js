import Rete from 'rete';
import InputNumberField from './components/InputNumberField';

export default class InputNumberControl extends Rete.Control {
  static component = InputNumberField;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = InputNumberControl.component;

    let initial = 0;
    if (node.data[key] !== undefined) {
      initial = node.data[key];
    }
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

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}
