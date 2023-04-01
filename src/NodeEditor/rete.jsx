/* eslint-disable no-underscore-dangle */

import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from 'rete-area-plugin';
// import ContextMenuPlugin, { Menu, Item, Search } from 'rete-context-menu-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';

import { LS_KEY_NODE_EDITOR_DATA, NODE_EDITOR_ID } from '../constants';
import ConcatComponent from './ConcatComponent';
import CsvToJsonComponent from './CsvToJsonComponent';
import JsonComponent from './JsonComponent';
import TransformComponent from './TransformComponent';
import EvalCodeComponent from './EvalCodeComponent';
import GlobalComponent from './GlobalComponent';
import PreviewComponent from './PreviewComponent';
import UploadComponent from './UploadComponent';
import UploadCsvComponent from './UploadCsvComponent';
import RemoteDataComponent from './RemoteDataComponent';
import MapComponent from './MapComponent';
import MapMarkersComponent from './MapMarkersComponent';
import GeoJSONSourceComponent from './GeoJSONSourceComponent';
import LineLayerComponent from './LineLayerComponent';
import FillLayerComponent from './FillLayerComponent';
import CircleLayerComponent from './CircleLayerComponent';
import SymbolLayerComponent from './SymbolLayerComponent';
import MapLayerV2Component from './MapLayerV2Component';
import MapLayerV3Component from './MapLayerV3Component';
import MapLineLayerComponent from './MapLineLayerComponent';
import TurfLineStringComponent from './TurfLineStringComponent';
import {
  clearMap, loadConfig, reteContextMenuOptions,
} from './helpers';

export async function createEditor(container) {
  const concatComponent = new ConcatComponent();
  const transformComponent = new TransformComponent();
  const evalCodeComponent = new EvalCodeComponent();
  const globalComponent = new GlobalComponent();
  const previewComponent = new PreviewComponent();
  const csvToJsonComponent = new CsvToJsonComponent();
  const uploadCsvComponent = new UploadCsvComponent();
  const remoteDataComponent = new RemoteDataComponent();
  const mapMarkersComponent = new MapMarkersComponent();
  const mapLayerV2Component = new MapLayerV2Component();
  const mapLayerV3Component = new MapLayerV3Component();
  const mapLineLayerComponent = new MapLineLayerComponent();
  const turfLineStringComponent = new TurfLineStringComponent();
  const uploadComponent = new UploadComponent();

  const editor = new Rete.NodeEditor(NODE_EDITOR_ID, container);
  if (!window.___nodeMap) window.___nodeMap = {};
  window.___nodeMap.editor = editor;
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(ContextMenuPlugin, reteContextMenuOptions);

  const engine = new Rete.Engine(NODE_EDITOR_ID);

  const allComponents = ({
    uploadComponent,
    [JsonComponent.key]: new JsonComponent(),
    transformComponent,
    evalCodeComponent,
    globalComponent,
    concatComponent,
    previewComponent,
    csvToJsonComponent,
    uploadCsvComponent,
    remoteDataComponent,
    [MapComponent]: new MapComponent(),
    mapMarkersComponent,
    [GeoJSONSourceComponent.key]: new GeoJSONSourceComponent(),
    [LineLayerComponent.key]: new LineLayerComponent(),
    [FillLayerComponent.key]: new FillLayerComponent(),
    [CircleLayerComponent.key]: new CircleLayerComponent(),
    [SymbolLayerComponent.key]: new SymbolLayerComponent(),
    mapLayerV2Component,
    mapLayerV3Component,
    mapLineLayerComponent,
    turfLineStringComponent,
  });
  window.___nodeMap.allComponents = allComponents;
  Object.keys(allComponents).forEach((key) => {
    editor.register(allComponents[key]);
    engine.register(allComponents[key]);
    console.debug('createEditor components', editor.components);
  });

  await loadConfig(editor);

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      // console.log('process', editor.toJSON());
      await engine.abort();
      await engine.process(editor.toJSON());
    },
  );

  editor.on(
    'process nodecreated nodedraged noderemoved connectioncreated connectionremoved',
    async () => {
      const data = JSON.stringify(editor.toJSON());
      console.debug('Save data to local:', editor.toJSON());
      localStorage.setItem(LS_KEY_NODE_EDITOR_DATA, data);
    },
  );

  editor.on(
    'noderemoved',
    async (node/* Node */) => {
      console.debug('noderemoved', node, node.id);
    },
  );

  editor.view.resize();
  editor.trigger('process');

  // wait then zoom, prevent node with/height is 0 when calc bbox
  // AreaPlugin.zoomAt(editor, editor.nodes);
  setTimeout(() => {
    AreaPlugin.zoomAt(editor, editor.nodes);
  }, 100);

  return editor;
}

export function useRete() {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container).then((value) => {
        // console.log('created');
        editorRef.current = value;
      });
    }
  }, [container]);

  useEffect(
    () => () => {
      if (editorRef.current) {
        console.log('destroy rete');

        /**
         * This is useful when in development, React hot reload and call MapControl:constructor again and will addSource with same id
         * But because React hot reload will call this componentWillUnmount/useEffect thing
         * So we can put the map clean code here to do something like GC
         * This will remove all the mapbox map data created in MapControl and other controls
         */
        clearMap();

        editorRef.current.destroy();
      }
    },
    [],
  );

  return [setContainer];
}
