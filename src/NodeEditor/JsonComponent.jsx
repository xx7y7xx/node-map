/* eslint-disable max-classes-per-file */

import React, { } from 'react';
import Rete from 'rete';

export const jsonSocket = new Rete.Socket('Json value');

export class JsonControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  );

  constructor(emitter, key, node) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = JsonControl.component;

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
    this.update();
  }
}

export default class JsonComponent extends Rete.Component {
  constructor() {
    super('Json Node'); // node title
  }

  builder(node) {
    const out1 = new Rete.Output('json', 'Json Socket', jsonSocket);
    const ctrl = new JsonControl(this.editor, 'json', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) { // eslint-disable-line class-methods-use-this
    outputs.json = node.data.json; // eslint-disable-line no-param-reassign
  }
}
