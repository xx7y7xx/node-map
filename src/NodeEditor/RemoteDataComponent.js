import Rete from 'rete';
import axios from 'axios';
import Papa from 'papaparse';
import { message } from 'antd';

import RemoteDataControl from './RemoteDataControl';
import InputControl from './InputControl';
import DivControl from './DivControl';
import { objectSocket } from './JsonComponent';

const CONTROL_KEY_URL = 'inputControlUrl';
const CONTROL_KEY = 'remoteDataControl';
const CONTROL_KEY_JWT = 'inputControlJwt';
const CONTROL_KEY_X_AUTH_METHOD = 'inputControlXAuthMethod';
const CONTROL_KEY_ERROR_MESSAGE = 'errorMessage';
const OUTPUT_KEY = 'csv';

export default class RemoteDataComponent extends Rete.Component {
  constructor() {
    super('RemoteData'); // node title
  }

  builder(node) {
    this.node = node;
    node
      .addControl(new InputControl(this.editor, CONTROL_KEY_URL, node, { label: 'url' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_JWT, node, { label: 'headers.authorization' }))
      .addControl(new InputControl(this.editor, CONTROL_KEY_X_AUTH_METHOD, node, { label: 'headers.x-auth-method' }))
      .addControl(new RemoteDataControl(this.editor, CONTROL_KEY, {
        onClick: this.handleClick.bind(this),
      }))
      .addControl(new DivControl(CONTROL_KEY_ERROR_MESSAGE, 'Error: none'))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'JSON', objectSocket));
    if (node.data[CONTROL_KEY]) {
      node
        .addControl(new DivControl('title', 'cached data'));
    }
    return node;
  }

  // eslint-disable-next-line class-methods-use-this
  worker(node, inputs, outputs) {
    // eslint-disable-next-line no-param-reassign
    outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];
  }

  setControlValue(key, content) {
    const control = this.node.controls.get(key);
    if (control) {
      control.setValue(content);
    }
  }

  handleClick() {
    let xAuthMethod = window.NM_X_AUTH_METHOD;
    let jwt = window.NM_JWT;

    if (this.node.data.inputControlXAuthMethod) {
      xAuthMethod = this.node.data.inputControlXAuthMethod;
    }
    if (this.node.data.inputControlJwt) {
      jwt = this.node.data.inputControlJwt;
    }

    const headers = {
      'x-auth-method': xAuthMethod,
    };
    if (jwt) {
      headers.authorization = jwt;
    }

    axios({
      method: 'get',
      // https://gist.githubusercontent.com/xx7y7xx/487ec183c80e1fb04523cd08d6986f8c/raw/7adde5adce75f0a97f1fb1b6ac45274c11f0847e/mw1.csv
      url: this.node.data.inputControlUrl,
      headers,
      transformResponse: (data, responseHeaders) => {
        if (responseHeaders && responseHeaders['content-type'] === 'text/csv') {
          const result = Papa.parse(data, {
            header: true,
            dynamicTyping: true,
          });
          return result.data;
        }
        return data;
      },
    }).then((response) => {
      console.debug('[RemoteDataComponent] response:', response);
      this.setControlValue(CONTROL_KEY, response.data);
      this.editor.trigger('process');
    }).catch((err) => {
      console.error('[RemoteDataComponent] Failed to get remote data!', err);
      message.warn(`Failed to get remote data: ${err.message}`);
      this.setControlValue(CONTROL_KEY, '');
      this.setControlValue(CONTROL_KEY_ERROR_MESSAGE, `Error: ${err.message}`);
    });
  }
}
