import React from 'react';
import { Control, NodeEditor } from 'rete';
import { Button } from 'antd';

const RemoteDataField = ({
  onClick,
  onReset,
}: {
  onClick: () => void;
  onReset: () => void;
}) => (
  <div>
    <Button type="primary" onClick={onClick}>
      Send Request
    </Button>{' '}
    <Button danger onClick={onReset}>
      Reset
    </Button>
  </div>
);

type ControlInternalProps = {
  value: string;
  onClick: () => void;
  onReset: () => void;
};

export default class RemoteDataControl extends Control {
  static component = RemoteDataField;

  emitter: NodeEditor;
  component: typeof RemoteDataField;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(
    emitter: NodeEditor,
    key: string,
    { onClick }: { onClick: () => void },
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = RemoteDataControl.component;
    // const node = this.getNode();

    this.props = {
      value: '',
      onClick,
      onReset: () => {
        // this.setContent('');
      },
    };
  }

  // setContent(content) {
  //   this.putData(this.key, content); // put data on node
  //   this.update(); // Call react to render this control only
  //   this.emitter.trigger('process'); // call down stream to re-process data
  // }

  setValue(val: string) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  // getValue() {
  //   return this.props.value;
  // }
}
