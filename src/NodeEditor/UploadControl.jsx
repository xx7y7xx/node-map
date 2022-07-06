import React from 'react';
import Rete from 'rete';

export default class UploadControl extends Rete.Control {
  static component = ({ onChange }) => (
    <input type="file" onChange={onChange} />
  );

  constructor(emitter, key) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = UploadControl.component;

    this.props = {
      onChange: (event) => {
        const file = event.target.files[0];
        const fr = new FileReader();
        fr.onload = (evt) => {
          this.setContent(evt.target.result);
          this.emitter.trigger('process');
        };
        fr.readAsText(file);
      },
    };
  }

  setContent(content) {
    this.putData(this.key, content); // put data on node
    this.update(); // Call react to render this control only
  }
}
