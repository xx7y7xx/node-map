import { Control, NodeEditor, Node } from 'rete';
import ColorPickerAndExpressionField from './components/ColorPicker/ColorPickerAndExpressionField';

declare module 'rete' {
  interface ColorPickerAndExpressionControl {
    update: () => void;
  }
}

/**
 * this.key="fill-color"
 * ```json
 * // expression disabled
 * nodeData = {
 *   "fill-color": "#112233",
 *   "fill-color.color": "#112233",
 *   "fill-color.expression": "[\"get\", \"colorProp\"]",
 * }
 * // expression enabled
 * nodeData = {
 *   "fill-color": ["get", "colorProp"],
 *   "fill-color.color": "#112233",
 *   "fill-color.expression": "[\"get\", \"colorProp\"]",
 * }
 * ```
 */
export default class ColorPickerAndExpressionControl extends Control {
  static component = ColorPickerAndExpressionField;

  emitter: NodeEditor;

  component: typeof ColorPickerAndExpressionField;

  props: any;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(emitter: NodeEditor, key: string, node: Node, props: any = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = ColorPickerAndExpressionControl.component;

    let initial = '#000';
    if (node.data[key]) {
      initial = node.data[key] as string;
    } else if (props.defaultValue) {
      initial = props.defaultValue;
    }

    node.data[key] = initial;
    this.props = {
      ...props,
      value: initial,
      defaultValue: initial,
      onChange: (v: string) => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
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
