import React from 'react';
import Rete from 'rete';
import { Input } from 'antd';

export default class TextControl extends Rete.Control {
  static component = ({ label, value, onChange }) => (
    <div>
      <span>{label}</span>
      <Input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>

  );

  constructor(emitter, key, node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextControl.component;

    const initial = node.data[key] || '';

    node.data[key] = initial; // eslint-disable-line no-param-reassign
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
