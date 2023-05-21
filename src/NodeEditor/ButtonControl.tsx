import React from 'react';
import { Control, NodeEditor } from 'rete';

const ButtonComponent = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => (
  <button type="button" onClick={onClick}>
    {text}
  </button>
);

type ControlInternalProps = {
  text: string;
  onClick: () => void;
};

export default class ButtonControl extends Control {
  static component = ButtonComponent;

  emitter: NodeEditor;
  component: typeof ButtonComponent;
  props: ControlInternalProps;

  constructor(
    emitter: NodeEditor,
    key: string,
    { text, onClick }: { text: string; onClick: () => void },
  ) {
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
