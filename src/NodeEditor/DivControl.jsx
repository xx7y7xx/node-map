import React from 'react';
import Rete from 'rete';

export default class DivControl extends Rete.Control {
  static component = ({ text }) => (
    <div>{text}</div>
  );

  constructor(key, text) {
    super(key);
    this.key = key;
    this.component = DivControl.component;

    this.props = {
      text,
    };
  }
}
