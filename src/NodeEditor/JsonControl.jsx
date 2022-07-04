import React from 'react';
import Rete from 'rete';

export default class JsonControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <textarea
      rows={5}
      cols={40}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  constructor(emitter, key, node) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = JsonControl.component;

    this.props = {
      value: node.data[key] ? JSON.stringify(node.data[key]) : '',
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val); // put data on node
    this.update(); // Call react to render this control only
  }
}
