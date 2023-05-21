// @ts-nocheck

// import React from 'react';
import Rete from 'rete';
import axios from 'axios';
import * as turf from '@turf/turf';
import lodash from 'lodash';
import papaparse from 'papaparse';

// import AntdTextArea from 'NodeEditor/components/AntdTextArea';
import CodeEditor from 'NodeEditor/components/CodeEditor';
// import ReactSimpleCodeEditor from './ReactSimpleCodeEditor';

const isAsync = true;
const deps = {
  axios,
  lodash,
  papaparse,
  turf,
};

export default class EvalCodeControl extends Rete.Control {
  static component = CodeEditor;

  constructor(emitter, key, node, textAreaProps) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = EvalCodeControl.component;
    this.node = node;

    let initialCode = '';
    if (node.data[key] && node.data[key].code) {
      initialCode = node.data[key].code;
    } else {
      node.data[key] = {
        code: '',
        errMsg: '',
      };
    }

    this.props = {
      code: initialCode,
      onChange: (v) => {
        this.setKeyVal('code', v);
        this.emitter.trigger('process');
      },
      ...textAreaProps,
    };
  }

  // Rerender this component, react re-render
  rerender() {
    // When this Control first init, the update() function is not defined. No idea why.
    if (this.update) {
      this.update();
    } else {
      console.debug(
        'update() function not defined at this Control! Will not re-render the UI.',
      );
    }
  }

  setKeyVal(key, val) {
    this.props[key] = val;
    this.putData(this.key, {
      ...this.getData(this.key),
      [key]: val,
    });
    this.rerender();
  }

  async runCode(fnInput) {
    const fnStr = this.props.code;

    this.hideError();

    let fnOut;
    if (isAsync) {
      /*
       * async
       */
      const AsyncFunction = async function () {}.constructor; // eslint-disable-line
      const aFn = new AsyncFunction('input', 'deps', fnStr);

      try {
        fnOut = await aFn(fnInput, deps);
      } catch (err) {
        console.log('[ERROR] Failed to eval function!', err);
        this.showError(err);
      }
    } else {
      /*
       * sync
       */
      try {
        // eslint-disable-next-line no-new-func
        const fn = Function('input', 'deps', fnStr);

        fnOut = fn(fnInput, deps);
      } catch (err) {
        console.log('[ERROR] Failed to eval function!');

        this.showError(err);
      }
    }

    return fnOut;
  }

  showError(err) {
    this.setKeyVal('errMsg', `Failed to eval: ${err.message}`);
    this.rerender();
  }

  hideError() {
    this.setKeyVal('errMsg', '');
    this.rerender();
  }
}
