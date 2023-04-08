import { Control, Node, NodeEditor } from 'rete';
import JsonEditor from './components/JsonEditor';

type ControlInternalProps = {
  value?: string;
  onChange: (value: string) => void;
};

/**
 * Write JSON in textbox, store both thex original JSON text, and also the object parsed from JSON text
 * Note that the text and object may not the same when text failed to parse to a valid object, e.g. text="{"
 * Store data:
 * ```json
 * {
 *   "obj": {"foo":"bar"}
 *   "text": "{\"foo\":\"bar\"}"
 * }
 * ```
 */
export default class JsonControl extends Control {
  static component = JsonEditor;

  emitter: NodeEditor;
  component: typeof JsonEditor;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(emitter: NodeEditor, key: string, node: Node) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = JsonControl.component;

    this.props = {
      onChange: (text) => {
        this.setValue(text);
        this.emitter.trigger('process');
      },
    };

    // initialize textbox content
    if (node.data[key]) {
      if ((node.data[key] as any).text !== undefined) {
        this.props.value = (node.data[key] as any).text;
      }
    }
  }

  setValue(text: string) {
    this.props.value = text;

    let obj = null;
    if (text !== '') {
      try {
        obj = JSON.parse(text);
      } catch (err) {
        console.error(
          '[JsonControl] Failed to parse textbox content into JSON Object!',
          err,
        );
      }
    }

    // save both string and parsed object to node
    // `text` will be used to keep as internal state
    // `obj` will be used as output data to downstream like PreviewComponent
    this.putData(this.key, { text, obj }); // put data on node
    this.update(); // Call react to render this control only
  }
}
