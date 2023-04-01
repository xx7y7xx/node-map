import Rete from 'rete';
import SwitchField from './components/SwitchField';

export default class SwitchControl extends Rete.Control {
  static component = SwitchField;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SwitchControl.component;

    let initial = false;
    if (node.data[key] !== undefined) {
      initial = node.data[key];
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

  setChecked(checked) {
    this.props.checked = checked;
    this.putData(this.key, checked);
    this.update();
  }

  getChecked() {
    return this.props.checked;
  }
}
