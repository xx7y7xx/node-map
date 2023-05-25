import Rete, { Component, Node } from 'rete';
import axios from 'axios';
import Papa from 'papaparse';
import { message } from 'antd';

import RemoteDataControl from './RemoteDataControl';
import InputControl from './InputControl';
import DivControl from './DivControl';
import { objectSocket } from './JsonComponent';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

type NodeIdMapType = Record<string, Node>;

const INPUT_KEY_HEADERS = 'inputKeyHeaders';
const CONTROL_KEY_URL = 'inputControlUrl';
const CONTROL_KEY = 'remoteDataControl';
const CONTROL_KEY_ERROR_MESSAGE = 'errorMessage';
const OUTPUT_KEY = 'csv';

const KEY = 'RemoteData';
export default class RemoteDataComponent extends Component {
  /**
   * constructor only run 1 time when loading the node editor
   */
  constructor() {
    super(KEY); // node title
  }

  static key = KEY;
  static controlKeyUrl = CONTROL_KEY_URL;
  static outputKey = OUTPUT_KEY;

  nodeIdMap: NodeIdMapType = {};
  nmInputs?: WorkerInputs;

  /**
   * builder will run multiple times when creating nodes
   * if there are 3 nodes in node editor, then builder function will be called 3 times
   */
  async builder(node: Node) {
    this.nodeIdMap[node.id] = node;

    if (!this.editor) {
      return;
    }

    const input = new Rete.Input(INPUT_KEY_HEADERS, 'Headers', objectSocket);
    node
      .addInput(input)
      .addControl(
        new InputControl(this.editor, CONTROL_KEY_URL, node, { label: 'url' }),
      )
      .addControl(
        new RemoteDataControl(this.editor, CONTROL_KEY, {
          onClick: this.handleClick.bind(this, node.id),
        }),
      )
      .addControl(new DivControl(CONTROL_KEY_ERROR_MESSAGE, 'Error: none'))
      .addOutput(new Rete.Output(OUTPUT_KEY, 'JSON', objectSocket));
    if (node.data[CONTROL_KEY]) {
      node.addControl(new DivControl('title', 'cached data'));
    }
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    this.nmInputs = inputs;
    outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];
  }

  setControlValue(nodeId: number, key: string, content: string) {
    const control = this.nodeIdMap[nodeId].controls.get(key) as
      | DivControl
      | RemoteDataControl;
    if (control) {
      control.setValue(content);
    }
  }

  handleClick(nodeId: number) {
    const headers = this.nmInputs?.[INPUT_KEY_HEADERS][0] || {};

    // @ts-ignore
    axios({
      method: 'get',
      // https://gist.githubusercontent.com/xx7y7xx/487ec183c80e1fb04523cd08d6986f8c/raw/7adde5adce75f0a97f1fb1b6ac45274c11f0847e/mw1.csv
      url: this.nodeIdMap[nodeId].data[CONTROL_KEY_URL],
      headers,
      transformResponse: (data, responseHeaders) => {
        if (responseHeaders) {
          if (responseHeaders['content-type'] === 'text/csv') {
            const result = Papa.parse(data, {
              header: true,
              dynamicTyping: true,
            });
            return result.data;
          }
          if (
            ['application/json; charset=utf-8', 'application/geo+json'].indexOf(
              responseHeaders['content-type'],
            ) !== -1
          ) {
            return JSON.parse(data);
          }
          console.error(
            'RemoteDataComponent unknown response content type',
            responseHeaders,
          );
        }

        return data;
      },
    })
      .then((response) => {
        console.debug('[RemoteDataComponent] response:', response);
        this.setControlValue(nodeId, CONTROL_KEY, response.data);
        this.editor?.trigger('process');
      })
      .catch((err) => {
        console.error('[RemoteDataComponent] Failed to get remote data!', err);
        message.warning(`Failed to get remote data: ${err.message}`);
        this.setControlValue(nodeId, CONTROL_KEY, '');
        this.setControlValue(
          nodeId,
          CONTROL_KEY_ERROR_MESSAGE,
          `Error: ${err.message}`,
        );
      });
  }
}
