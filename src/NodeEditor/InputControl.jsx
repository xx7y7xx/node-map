import React from 'react';
import Rete from 'rete';
import { Input } from 'antd';

export default class InputControl extends Rete.Control {
  static component = ({ label, value, onChange }) => (
    <div>
      <span>{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPointerDown={(e) => {
          // When selecting text in input box, the node should not move
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
        // When double clicking in this text box, the node should not move
          e.stopPropagation();
        }}
      />
    </div>

  );

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
