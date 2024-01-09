import { NodeData, WorkerInputs } from 'rete/types/core/data'; // eslint-disable-line import/no-unresolved

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
