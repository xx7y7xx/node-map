import React from 'react';
import Rete from 'rete';

export default class TextControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <textarea
      rows={4}
      cols={30}
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

    node.data[key] = initial;
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
    // `update` function for control is defined when event "rendercontrol"
    // so `update` function may be undefined at the initial stage of page loading
    // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
    // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
    if (this.update) {
      this.update();
    }
  }

  getValue() {
    return this.props.value;
  }
}
