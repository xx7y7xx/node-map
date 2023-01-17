import React from 'react';
import Rete from 'rete';
import { Button } from 'antd';

export default class RemoteDataControl extends Rete.Control {
  static component = ({ onClick, onReset }) => (
    <div>
      <Button type="primary" onClick={onClick}>Send Request</Button>
      {' '}
      <Button type="danger" onClick={onReset}>Reset</Button>
    </div>
  );

  constructor(emitter, key, { onClick }) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = RemoteDataControl.component;
    // const node = this.getNode();

    this.props = {
      onClick,
      onReset: () => {
        this.setContent('');
      },
    };
  }

  // setContent(content) {
  //   this.putData(this.key, content); // put data on node
  //   this.update(); // Call react to render this control only
  //   this.emitter.trigger('process'); // call down stream to re-process data
  // }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}
