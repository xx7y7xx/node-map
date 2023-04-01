import Rete from 'rete';
import SelectField from './components/SelectField';

export default class SelectControl extends Rete.Control {
  static component = SelectField;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SelectControl.component;

    let initial = '';
    if (props.mode === 'multiple') {
      initial = [];
    }
    if (node.data[key]) {
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
