import React from 'react';
import Rete from 'rete';

export default class ButtonControl extends Rete.Control {
  static component = ({ text, onClick }) => (
    <button type="button" onClick={onClick}>{text}</button>
  );

  constructor(emitter, key, { text, onClick }) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = ButtonControl.component;

    this.props = {
      text,
      onClick: () => {
        onClick();
        this.emitter.trigger('process');
      },
    };
  }
}
