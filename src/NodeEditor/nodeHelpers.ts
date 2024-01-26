import Rete, { Node } from 'rete';
import { NodeData, WorkerInputs } from 'rete/types/core/data'; // eslint-disable-line import/no-unresolved

import { objectSocket } from './JsonComponent';

export const convertTextField = (textField: string) => {
  const inputBoxStr = textField || '';
  if (!inputBoxStr.startsWith('[')) {
    return textField;
  }
  return JSON.parse(inputBoxStr);
};

// get the property value from node's saved data or data from input connections
export const getPropertyValue = (
  key: string,
  node: NodeData,
  inputs: WorkerInputs,
) => {
  // TODO
  if (key === 'text-field') {
    return convertTextField(node.data[key] as string);
  }

  if (inputs[key] && inputs[key][0]) {
    return inputs[key][0];
  }

  return node.data[key];
};

export const inputControlFactory =
  (editor: any, node: Node) =>
  (inputItem: {
    key: string;
    label: string;
    control: any;
    defaultValue?: any;
    props?: any;
  }) => {
    const { key, label, control: Ctrl, props = {} } = inputItem;

    // set default value on node data
    if (inputItem.defaultValue) {
      node.data[key] = inputItem.defaultValue;
    }

    const ct = new Ctrl(editor!, key, node, {
      label: label,
      ...props,
    });
    const inp = new Rete.Input(key, label, objectSocket);
    inp.addControl(ct);
    node.addInput(inp);
  };
