import React from 'react';
import Rete from 'rete';
import { Slider, InputNumber } from 'antd';

export default class SliderControl extends Rete.Control {
  static component = ({ label, value, onChange }) => (
    <div onPointerDown={(e) => {
      // When drag slider, the node should not move
      e.stopPropagation();
    }}
    >
      <span>{label}</span>
      <Slider
        min={1}
        max={20}
        defaultValue={1}
        value={value}
        onChange={(val) => onChange(val)}
      />
      <InputNumber
        value={value}
        onChange={(val) => onChange(val)}
      />
    </div>

  );

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
