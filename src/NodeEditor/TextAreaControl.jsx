import React from 'react';
import Rete from 'rete';
import { Input } from 'antd';

const { TextArea } = Input;

export default class TextAreaControl extends Rete.Control {
  static component = ({
    cols, rows = 4, value, onChange,
  }) => (
    <TextArea
      style={{ fontFamily: 'monospace' }}
      rows={rows}
      cols={cols}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onPointerDown={(e) => {
        // When selecting in this text box, the node should not move
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        // When double clicking in this text box, the node should not move
        e.stopPropagation();
      }}
    />
  );

  constructor(emitter, key, node, textAreaProps) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextAreaControl.component;

    const initial = node.data[key] || '';

    node.data[key] = initial;
    this.props = {
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
      ...textAreaProps,
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
