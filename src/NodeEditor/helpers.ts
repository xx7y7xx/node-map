/* eslint-disable import/prefer-default-export, no-underscore-dangle */

import { message } from 'antd';
import axios from 'axios';
import {
  mapboxSourceLayerIdPrefix,
  mapboxLayerIdPrefix,
  LS_KEY_NODE_EDITOR_DATA,
} from '../constants';
import { Layer } from 'mapbox-gl';
import { Component, NodeEditor } from 'rete';

export const getUrlParams = () =>
  new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });

export const deleteUrlParam = (paramName: string) => {
  // Delete ?load= param in URL
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(paramName);
  window.location.search = searchParams.toString();
};

export const loadConfig = async (editor: NodeEditor) => {
  const params = getUrlParams();
  // @ts-ignore
  if (params.load) {
    await axios({
      method: 'get',
      // @ts-ignore
      url: params.load,
    })
      .then((response) => {
        console.debug('[loadConfig] response', response);
        message.success('Config data loaded.');

        // Delete ?load= param in URL
        deleteUrlParam('load');

        return editor.fromJSON(response.data);
      })
      .catch((err) => {
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

export const reteContextMenuOptions = {
  searchBar: false, // true by default
  // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
  // searchKeep: (title) => true,
  searchKeep: () => true,
  delay: 100,
  allocate(/*component*/) {
    // console.log('allocate(component)', component);
    return ['Submenu'];
  },
  rename(component: Component) {
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
};

export const downloadObjectAsJson = (
  exportJsonString: string,
  exportName: string,
) => {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
    exportJsonString,
  )}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const genSourceId = () =>
  `${mapboxSourceLayerIdPrefix}${Math.round(Math.random() * 1000)}`;
export const genLayer = () =>
  `${mapboxLayerIdPrefix}${Math.round(Math.random() * 1000)}`;

export const clearMap = () => {
  const map = window.mapbox;

  map.getStyle().layers.forEach((layer: Layer) => {
    if (layer.id.startsWith(mapboxLayerIdPrefix)) {
      console.debug('Clear layer:', layer.id);
      map.removeLayer(layer.id);
    }
  });

  Object.keys(map.getStyle().sources).forEach((sourceId) => {
    if (sourceId.startsWith(mapboxSourceLayerIdPrefix)) {
      console.log('Clear source:', sourceId);
      map.removeSource(sourceId);
    }
  });
};

export const clearEditorAndMap = () => {
  const { editor } = window.___nodeMap;

  editor?.clear();
  clearMap();
};

export const clearEditorAndMapConfirm = () => {
  if (window.confirm('Are you sure to clear all data?') !== true) {
    // eslint-disable-line no-alert
    return;
  }
  clearEditorAndMap();
};
