import { Control, Node, NodeEditor } from 'rete';
import { DefaultOptionType } from 'antd/es/select';
import SelectField from './components/SelectField';
import { CSSProperties } from 'react';

type ControlInternalProps = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
};

export default class SelectControl extends Control {
  static component = SelectField;

  emitter: NodeEditor | null;
  component: typeof SelectField;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(
    emitter: NodeEditor | null,
    key: string,
    node: Node,
    props: {
      label: string;
      mode?: string;
      style?: CSSProperties;
      options?: DefaultOptionType[];
    } = {
      label: '',
      mode: '',
    },
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SelectControl.component;

    let initial: string | string[] = '';
    if (props.mode === 'multiple') {
      initial = [];
    }
    if (node.data[key]) {
      initial = node.data[key] as string | string[];
    }

    node.data[key] = initial;
    this.props = {
      ...props,
      value: initial,
      onChange: (v: string | string[]) => {
        this.setValue(v);
        this.emitter?.trigger('process');
      },
    };
  }

  setValue(val: string | string[]) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.props.value;
  }
}

export const genOpts = (arr: string[]) =>
  arr.map((item) => ({
    value: item,
    label: item,
  }));
