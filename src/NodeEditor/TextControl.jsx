import React, { } from 'react';
import Rete from 'rete';

export default class TextControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  );

  constructor(emitter, key, node) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextControl.component;

    const initial = node.data[key] || '';

    node.data[key] = initial; // eslint-disable-line no-param-reassign
    this.props = {
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
}
