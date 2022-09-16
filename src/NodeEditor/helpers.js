/* eslint-disable import/prefer-default-export */

import mockJsonData from './mockData.json';

const defaultFnStr = `return input.data.map((item) => (
  [item.point.Lng, item.point.Lat]
))`;

export const createSampleNodes = async (editor, {
  uploadComponent, jsonComponent, transformComponent, transformEvalComponent,
  concatComponent, previewComponent,
}) => {
  const uploadNode = await uploadComponent.createNode({ upload: {} });
  const jsonNode = await jsonComponent.createNode({
    json: mockJsonData,
  });
  const transformNode = await transformComponent.createNode();
  const transformEvalNode = await transformEvalComponent.createNode({ fnStr: defaultFnStr });
  const concatNode = await concatComponent.createNode({ inputCount: 2 });
  const previewNode = await previewComponent.createNode();

  uploadNode.position = [0, 500];
  jsonNode.position = [0, 0];
  transformNode.position = [500, 0];
  transformEvalNode.position = [500, 500];
  concatNode.position = [1000, 0];
  previewNode.position = [1500, 0];

  editor.addNode(uploadNode);
  editor.addNode(jsonNode);
  editor.addNode(transformNode);
  editor.addNode(transformEvalNode);
  editor.addNode(concatNode);
  editor.addNode(previewNode);

  editor.connect(
    jsonNode.outputs.get('json'),
    transformNode.inputs.get('json'),
  );
  editor.connect(
    uploadNode.outputs.get('json'),
    transformEvalNode.inputs.get('json'),
  );
  editor.connect(
    transformNode.outputs.get('json'),
    concatNode.inputs.get('json0'),
  );
  editor.connect(
    transformEvalNode.outputs.get('json'),
    concatNode.inputs.get('json1'),
  );
  editor.connect(
    concatNode.outputs.get('json'),
    previewNode.inputs.get('json'),
  );
};
