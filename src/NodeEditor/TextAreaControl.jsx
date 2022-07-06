import React from 'react';
import Rete from 'rete';

export default class TextAreaControl extends Rete.Control {
  static component = ({ cols, value, onChange }) => (
    <textarea
      rows="4"
      cols={cols}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  constructor(emitter, key, node, { cols }) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextAreaControl.component;

    const initial = node.data[key] || '';

    node.data[key] = initial; // eslint-disable-line no-param-reassign
    this.props = {
      value: initial,
      cols,
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
