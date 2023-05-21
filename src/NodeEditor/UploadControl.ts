import { Control, NodeEditor } from 'rete';
import UploadField from './components/UploadField';

type ControlInternalProps = {
  onChange: (event: Event) => void;
};

export default class UploadControl extends Control {
  static component = UploadField;

  emitter: NodeEditor | null;
  component: typeof UploadField;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(emitter: NodeEditor | null, key: string) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = UploadControl.component;

    this.props = {
      onChange: (event: Event) => {
        if (!event.target) return;
        if ((event.target as HTMLInputElement).files) {
          if ((event.target as HTMLInputElement).files!.length > 0) {
            const file = (event.target as HTMLInputElement).files![0];
            const fr = new FileReader();
            fr.onload = (evt) => {
              if (!evt.target) {
                console.error('Failed to read file', evt);
                return;
              }
              this.setContent(evt.target.result as string);
              this.emitter?.trigger('process');
            };
            fr.readAsText(file);
          }
        }
      },
    };
  }

  setContent(content: string) {
    this.putData(this.key, content); // put data on node
    this.update(); // Call react to render this control only
  }
}
