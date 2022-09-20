import React from 'react';
import Rete from 'rete';

export default class TextControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onPointerDown={(e) => {
        // When drag slider, the node should not move
        e.stopPropagation();
      }}
    />
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
    // there is no `update` function for control, consider calling `update` on node
    // this.update();
  }

  getValue() {
    return this.props.value;
  }
}
