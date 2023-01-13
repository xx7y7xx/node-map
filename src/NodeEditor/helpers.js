/* eslint-disable import/prefer-default-export, no-underscore-dangle */

import mockJsonData from './mockData.json';

const defaultFnStr = `return input.data.map((item) => (
  [item.point.Lng, item.point.Lat]
))`;

export const createSampleNodes = async () => {
  const { editor, allComponents } = window.___nodeMap;

  const uploadNode = await allComponents.uploadComponent.createNode({ upload: {} });
  const jsonNode = await allComponents.jsonComponent.createNode({
    json: mockJsonData,
  });
  const transformNode = await allComponents.transformComponent.createNode();
  const evalCodeNode = await allComponents.evalCodeComponent.createNode({ fnStr: defaultFnStr }); // eslint-disable-line max-len
  const concatNode = await allComponents.concatComponent.createNode({ inputCount: 2 });
  const previewNode = await allComponents.previewComponent.createNode();

  uploadNode.position = [0, 500];
  jsonNode.position = [0, 0];
  transformNode.position = [500, 0];
  evalCodeNode.position = [500, 500];
  concatNode.position = [1000, 0];
  previewNode.position = [1500, 0];

  editor.addNode(uploadNode);
  editor.addNode(jsonNode);
  editor.addNode(transformNode);
  editor.addNode(evalCodeNode);
  editor.addNode(concatNode);
  editor.addNode(previewNode);

  editor.connect(
    jsonNode.outputs.get('json'),
    transformNode.inputs.get('json'),
  );
  editor.connect(
    uploadNode.outputs.get('json'),
    evalCodeNode.inputs.get('json'),
  );
  editor.connect(
    transformNode.outputs.get('json'),
    concatNode.inputs.get('json0'),
  );
  editor.connect(
    evalCodeNode.outputs.get('json'),
    concatNode.inputs.get('json1'),
  );
  editor.connect(
    concatNode.outputs.get('json'),
    previewNode.inputs.get('json'),
  );
};

export const getUrlParams = () => new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

export const deleteUrlParam = (paramName) => {
  // Delete ?load= param in URL
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(paramName);
  window.location.search = searchParams.toString();
};
