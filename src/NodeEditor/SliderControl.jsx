import Rete from 'rete';
import NumberSlider from './components/NumberSlider';

export default class SliderControl extends Rete.Control {
  static component = NumberSlider;

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SliderControl.component;

    const initial = node.data[key] || 1;

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
