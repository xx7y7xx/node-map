import React from 'react';
import Rete from 'rete';

export default class DivControl extends Rete.Control {
  static component = ({ value }) => (
    <div>{value}</div>
  );

  constructor(key, value) {
    super(key);
    this.key = key;
    this.component = DivControl.component;

    this.props = {
      value,
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
