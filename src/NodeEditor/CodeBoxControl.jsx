import React from 'react';
import Rete from 'rete';
import { Input } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const isAsync = true;

export default class CodeBoxControl extends Rete.Control {
  static component = (props) => {
    const {
      cols, rows = 4, code, onChange, errMsg,
    } = props;
    console.debug('CodeBoxControl.component', props);
    return (
      <div>
        <TextArea
          style={{ fontFamily: 'monospace' }}
          rows={rows}
          cols={cols}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onPointerDown={(e) => {
          // When selecting in this text box, the node should not move
            e.stopPropagation();
          }}
          onDoubleClick={(e) => {
          // When double clicking in this text box, the node should not move
            e.stopPropagation();
          }}
        />
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
      // eslint-disable-next-line no-param-reassign
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
    this.rerender(); // re-render
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
    this.rerender(); // Rerender this component
  }

  hideError() {
    this.setKeyVal('errMsg', '');
    this.rerender(); // Rerender this component
  }
}
