/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import Rete from 'rete';

import RequestHeaders from './components/RequestHeaders';

export default class RequestHeadersControl extends Rete.Control {
  static component = (props) => (
    <RequestHeaders {...props} />
  );

  constructor(emitter, key, node) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = RequestHeadersControl.component;

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
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}
