// import React from 'react';
import { Control, Node, NodeEditor } from 'rete';
import axios from 'axios';
import * as turf from '@turf/turf';
import lodash from 'lodash';
import papaparse from 'papaparse';

// import AntdTextArea from 'NodeEditor/components/AntdTextArea';
import CodeEditor from 'NodeEditor/components/CodeEditor';
// import ReactSimpleCodeEditor from './ReactSimpleCodeEditor';

type ControlInternalProps = {
  code: string;
  errMsg: string;
  result: string;
  onChange: (code: string) => void;
};

type EvalCodeControlNodeData = {
  code: string;
};

const isAsync = true;
const deps = {
  axios,
  lodash,
  papaparse,
  turf,
};

export default class EvalCodeControl extends Control {
  static component = CodeEditor;

  emitter: NodeEditor;
  component: typeof CodeEditor;
  props: ControlInternalProps;
  node: Node;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(
    emitter: NodeEditor,
    key: string,
    node: Node,
    textAreaProps = {},
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = EvalCodeControl.component;
    this.node = node;

    let initialCode = '';
    if (node.data[key] && (node.data[key] as EvalCodeControlNodeData).code) {
      initialCode = (node.data[key] as EvalCodeControlNodeData).code;
    } else {
      node.data[key] = {
        code: '',
        errMsg: '',
        result: '',
      };
    }

    this.props = {
      code: initialCode,
      errMsg: '',
      result: '',
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

  setKeyVal(key: 'code' | 'errMsg' | 'result', val: string) {
    (this.props as ControlInternalProps)[key] = val;
    this.putData(this.key, {
      ...(this.getData(this.key) as EvalCodeControlNodeData),
      [key]: val,
    });
    this.rerender();
  }

  async runCode(fnInput: string) {
    const fnStr = this.props.code;

    this.hideError();

    let fnOut;
    if (isAsync) {
      /*
       * async
       */
      const AsyncFunction = async function () {}.constructor; // eslint-disable-line
      // @ts-ignore
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
    this.showResult(JSON.stringify(fnOut));

    return fnOut;
  }

  showError(err: unknown) {
    if (err instanceof Error) {
      this.setKeyVal('errMsg', `Failed to eval: ${err.message}`);
    }
  }

  showResult(result: string) {
    this.setKeyVal('result', result);
  }

  hideError() {
    this.setKeyVal('errMsg', '');
  }
}
