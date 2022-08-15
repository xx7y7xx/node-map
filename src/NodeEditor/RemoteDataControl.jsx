import React from 'react';
import Rete from 'rete';
import { Button } from 'antd';
import axios from 'axios';

export default class RemoteDataControl extends Rete.Control {
  static component = ({ onClick, onReset }) => (
    <div>
      <Button onClick={onClick}>Send Request</Button>
      {' '}
      <Button type="danger" onClick={onReset}>Reset</Button>
    </div>
  );

  constructor(emitter, key) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = RemoteDataControl.component;

    this.props = {
      onClick: () => {
        const node = this.getNode();
        axios({
          method: 'get',
          // https://gist.githubusercontent.com/xx7y7xx/487ec183c80e1fb04523cd08d6986f8c/raw/7adde5adce75f0a97f1fb1b6ac45274c11f0847e/mw1.csv
          url: node.data.inputControlUrl,
          headers: {
            'x-auth-method': node.data.inputControlXAuthMethod,
            authorization: node.data.inputControlJwt,
          },
        }).then((response) => {
          this.setContent(response.data);
        }).catch((err) => {
          console.error('[RemoteDataControl] Failed to get remote data!', err);
          this.setContent('');
        });
      },
      onReset: () => {
        this.setContent('');
      },
    };
  }

  setContent(content) {
    this.putData(this.key, content); // put data on node
    this.update(); // Call react to render this control only
    this.emitter.trigger('process'); // call down stream to re-process data
  }
}
