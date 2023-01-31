/* eslint-disable import/prefer-default-export, no-underscore-dangle */

import { message } from 'antd';
import axios from 'axios';
import { LS_KEY_NODE_EDITOR_DATA } from 'constants';
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

export const loadConfig = async (editor) => {
  const params = getUrlParams();
  if (params.load) {
    await axios({
      method: 'get',
      url: params.load,
    }).then((response) => {
      console.debug('[loadConfig] response', response);
      message.success('Config data loaded.');

      // Delete ?load= param in URL
      deleteUrlParam('load');

      return editor.fromJSON(response.data);
    }).catch((err) => {
      console.error('[loadConfig] Failed to get remote data!', err);
      message.warning(`Failed to get remote data: ${err.message}`);
    });
  } else {
    const localData = localStorage.getItem(LS_KEY_NODE_EDITOR_DATA);
    if (localData) {
      console.debug('Load data from local', JSON.parse(localData));
      await editor.fromJSON(JSON.parse(localData));
    }
  }
};

export const reteContextMenuOptions = ({
  searchBar: false, // true by default
  // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
  // searchKeep: (title) => true,
  searchKeep: () => true,
  delay: 100,
  allocate(component) { // eslint-disable-line no-unused-vars
    // console.log('allocate(component)', component);
    return ['Submenu'];
  },
  rename(component) {
    return component.name;
  },
  items: {
    // 'Click me': () => { console.log('Works!'); },
  },
  nodeItems: {
    // 'Click me': () => { console.log('Works for node!'); },
    Delete: true, // delete this node
    Clone: true, // clone this node
  },
});
