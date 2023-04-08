import React from 'react';
import { Control } from 'rete';

const Div = ({ value }: { value: string }) => <div>{value}</div>;

export default class DivControl extends Control {
  static component = Div;

  component: typeof Div;
  props: {
    value: string;
  };

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(key: string, value: string) {
    super(key);
    this.key = key;
    this.component = DivControl.component;

    this.props = {
      value,
    };
  }

  setValue(val: string) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}
