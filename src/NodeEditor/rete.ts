/* eslint-disable no-underscore-dangle */

import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Rete, { NodeEditor } from 'rete';
// @ts-ignore: no declaration file for module
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
// @ts-ignore: no declaration file for module
import AreaPlugin from 'rete-area-plugin';
// @ts-ignore: no declaration file for module
import ContextMenuPlugin from 'rete-context-menu-plugin';

import { LS_KEY_NODE_EDITOR_DATA, NODE_EDITOR_ID } from '../constants';
import ConcatComponent from './ConcatComponent';
// import CsvToJsonComponent from './CsvToJsonComponent';
import JsonComponent from './JsonComponent';
// import TransformComponent from './TransformComponent';
import EvalCodeComponent from './EvalCodeComponent';
// import GlobalComponent from './GlobalComponent';
// import PreviewComponent from './PreviewComponent';
import UploadComponent from './UploadComponent';
// import UploadCsvComponent from './UploadCsvComponent';
import RemoteDataComponent from './RemoteDataComponent';
import MapComponent from './MapComponent';
// import MapMarkersComponent from './MapMarkersComponent';
import GeoJSONSourceComponent from './GeoJSONSourceComponent';
import LineLayerComponent from './LineLayerComponent';
import FillLayerComponent from './FillLayerComponent';
import CircleLayerComponent from './CircleLayerComponent';
import SymbolLayerComponent from './SymbolLayerComponent';
import MapSourceAndLayerV3Component from './MapSourceAndLayerV3Component';
// import MapLineLayerComponent from './MapLineLayerComponent';
// import TurfLineStringComponent from './TurfLineStringComponent';
import { clearMap, loadConfig, reteContextMenuOptions } from './helpers';
import ImageComponent from './ImageComponent';

type WindowNodeMapProp = {
  editor?: NodeEditor;
  allComponents?: any; // DEPRECATED
};

declare global {
  interface Window {
    ___nodeMap: WindowNodeMapProp;
  }
}

export async function createEditor(container: HTMLDivElement) {
  // const transformComponent = new TransformComponent();
  // const globalComponent = new GlobalComponent();
  // const previewComponent = new PreviewComponent();
  // const csvToJsonComponent = new CsvToJsonComponent();
  // const uploadCsvComponent = new UploadCsvComponent();
  // const remoteDataComponent = new RemoteDataComponent();
  // const mapMarkersComponent = new MapMarkersComponent();
  // const mapLineLayerComponent = new MapLineLayerComponent();
  // const turfLineStringComponent = new TurfLineStringComponent();

  const editor = new Rete.NodeEditor(NODE_EDITOR_ID, container);
  if (!window.___nodeMap) window.___nodeMap = {};
  window.___nodeMap.editor = editor;
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(ContextMenuPlugin, reteContextMenuOptions);

  const engine = new Rete.Engine(NODE_EDITOR_ID);

  const allComponents: any = {
    [UploadComponent.key]: new UploadComponent(),
    [JsonComponent.key]: new JsonComponent(),
    // transformComponent,
    [EvalCodeComponent.key]: new EvalCodeComponent(),
    // globalComponent,
    [ConcatComponent.key]: new ConcatComponent(),
    // previewComponent,
    // csvToJsonComponent,
    // uploadCsvComponent,
    [RemoteDataComponent.key]: new RemoteDataComponent(),
    [MapComponent.key]: new MapComponent(),
    // mapMarkersComponent,
    [ImageComponent.key]: new ImageComponent(),
    [GeoJSONSourceComponent.key]: new GeoJSONSourceComponent(),
    [LineLayerComponent.key]: new LineLayerComponent(),
    [FillLayerComponent.key]: new FillLayerComponent(),
    [CircleLayerComponent.key]: new CircleLayerComponent(),
    [SymbolLayerComponent.key]: new SymbolLayerComponent(),
    [MapSourceAndLayerV3Component.key]: new MapSourceAndLayerV3Component(),
    // mapLineLayerComponent,
    // turfLineStringComponent,
  };
  window.___nodeMap.allComponents = allComponents;
  Object.keys(allComponents).forEach((key) => {
    editor.register(allComponents[key]);
    engine.register(allComponents[key]);
    console.debug('createEditor components', editor.components);
  });

  await loadConfig(editor);

  editor.on(
    // @ts-ignore
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      // console.log('process', editor.toJSON());
      await engine.abort();
      await engine.process(editor.toJSON());
    },
  );

  editor.on(
    // @ts-ignore
    'process nodecreated nodedraged noderemoved connectioncreated connectionremoved',
    async () => {
      const data = JSON.stringify(editor.toJSON());
      console.debug('Save data to local:', editor.toJSON());
      localStorage.setItem(LS_KEY_NODE_EDITOR_DATA, data);
    },
  );

  editor.on('noderemoved', async (node /* Node */) => {
    console.debug('noderemoved', node, node.id);
  });

  editor.view.resize();
  editor.trigger('process');

  // wait then zoom, prevent node with/height is 0 when calc bbox
  // AreaPlugin.zoomAt(editor, editor.nodes);
  setTimeout(() => {
    AreaPlugin.zoomAt(editor, editor.nodes);
  }, 500);

  return editor;
}

export function useRete() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const editorRef = useRef<NodeEditor>();

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

        (editorRef.current as NodeEditor).destroy();
      }
    },
    [],
  );

  return [setContainer];
}
