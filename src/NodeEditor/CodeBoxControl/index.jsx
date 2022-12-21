import React from 'react';
import Rete from 'rete';
import axios from 'axios';

// import AntdTextArea from './AntdTextArea';
import ReactSimpleCodeEditor from './ReactSimpleCodeEditor';

const isAsync = true;

export default class CodeBoxControl extends Rete.Control {
  static component = (props) => {
    const {
      code, onChange, errMsg,
    } = props;
    // console.debug('CodeBoxControl.component', props);
    return (
      <div>
        {/* <AntdTextArea code={code} onChange={onChange} errMsg={errMsg} /> */}
        <ReactSimpleCodeEditor code={code} onChange={onChange} errMsg={errMsg} />
        <br />
        {errMsg}
      </div>
    );
  };

  constructor(emitter, key, node, textAreaProps) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = CodeBoxControl.component;
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
    if (this.update) {
      this.update();
    } else {
      console.debug('update function not defined!');
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

  async run(fnInput) {
    const fnStr = this.props.code;

    this.hideError();

    let fnOut;
    if (isAsync) {
      /*
       * async
       */
      const AsyncFunction = async function () { }.constructor; // eslint-disable-line
      const aFn = new AsyncFunction('input', 'deps', fnStr);

      try {
        fnOut = await aFn(fnInput, { axios });
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

        fnOut = fn(fnInput, {
          axios,
        });
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
