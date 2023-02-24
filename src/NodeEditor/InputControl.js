import Rete from 'rete';
import InputField from './components/InputField';

export default class InputControl extends Rete.Control {
  static component = InputField;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = InputControl.component;

    const initial = node.data[key] || '';

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
