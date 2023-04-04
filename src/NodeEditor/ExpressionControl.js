import Rete from 'rete';
import ExpressionField from './components/ExpressionField';

export default class ExpressionControl extends Rete.Control {
  static component = ExpressionField;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = ExpressionControl.component;

    const initial = node.data[key];

    this.props = {
      ...props,
      defaultValue: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
    };
  }

  setValue(val) {
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.getData(this.key);
  }
}
