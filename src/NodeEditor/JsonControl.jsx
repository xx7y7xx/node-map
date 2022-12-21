import React from 'react';
import Rete from 'rete';
import ReactSimpleCodeEditor from './CodeBoxControl/ReactSimpleCodeEditor';

export default class JsonControl extends Rete.Control {
  static component = ({ value = '', onChange }) => (
    <>
      {/* <textarea
        rows={5}
        cols={40}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPointerDown={(e) => {
          // When drag slider, the node should not move
          e.stopPropagation();
        }}
      /> */}
      <ReactSimpleCodeEditor code={value} onChange={onChange} />
    </>
  );

  constructor(emitter, key, node) {
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
      if (node.data[key].text !== undefined) {
        this.props.value = node.data[key].text;
      }
    }
  }

  setValue(text) {
    this.props.value = text;

    let obj = null;
    if (text !== '') {
      try {
        obj = JSON.parse(text);
      } catch (err) {
        console.error('[JsonControl] Failed to parse textbox content into JSON Object!', err);
      }
    }

    // save both string and parsed object to node
    // `text` will be used to keep as internal state
    // `obj` will be used as output data to downstream like PreviewComponent
    this.putData(this.key, { text, obj }); // put data on node
    this.update(); // Call react to render this control only
  }
}
