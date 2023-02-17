import Rete from 'rete';
import ColorPicker from './components/ColorPicker';

export default class ColorPickerControl extends Rete.Control {
  static component = ColorPicker;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = ColorPickerControl.component;

    const initial = node.data[key] || '#000';

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
