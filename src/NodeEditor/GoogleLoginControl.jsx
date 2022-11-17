import React from 'react';
import Rete from 'rete';

import GoogleLogin from 'components/GoogleLogin';

export default class GoogleLoginControl extends Rete.Control {
  static component = (/* { text, onClick  } */) => (
    // <button type="button" onClick={onClick}>{text}</button>
    <GoogleLogin />
  );

  constructor(emitter, key, { text, onClick }) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = GoogleLoginControl.component;

    this.props = {
      text,
      onClick: () => {
        onClick();
        this.emitter.trigger('process');
      },
    };
  }
}
