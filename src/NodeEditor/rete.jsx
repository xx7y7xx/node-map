import { useState, useEffect, useRef } from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from 'rete-area-plugin';
// import ContextMenuPlugin, { Menu, Item, Search } from 'rete-context-menu-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';

import JsonComponent from './JsonComponent';
import TransformComponent from './TransformComponent';
import TransformEvalComponent from './TransformEvalComponent';
import PreviewComponent from './PreviewComponent';
import UploadComponent from './UploadComponent';
import ConcatComponent from './ConcatComponent';
import CsvToJsonComponent from './CsvToJsonComponent';
import UploadCsvComponent from './UploadCsvComponent';
import RemoteDataComponent from './RemoteDataComponent';
import MapComponent from './MapComponent';
import MapMarkersComponent from './MapMarkersComponent';
import MapGeoJsonComponent from './MapGeoJsonComponent';
import MapLayerComponent from './MapLayerComponent';
import AuthComponent from './AuthComponent';
import TurfLineStringComponent from './TurfLineStringComponent';
import { createSampleNodes } from './helpers';

export async function createEditor(container) {
  const uploadComponent = new UploadComponent();
  const jsonComponent = new JsonComponent();
  const transformComponent = new TransformComponent();
  const transformEvalComponent = new TransformEvalComponent();
  const concatComponent = new ConcatComponent();
  const previewComponent = new PreviewComponent();
  const csvToJsonComponent = new CsvToJsonComponent();
  const uploadCsvComponent = new UploadCsvComponent();
  const remoteDataComponent = new RemoteDataComponent();
  const mapComponent = new MapComponent();
  const mapMarkersComponent = new MapMarkersComponent();
  const mapGeoJsonComponent = new MapGeoJsonComponent();
  const mapLayerComponent = new MapLayerComponent();
  const authComponent = new AuthComponent();
  const turfLineStringComponent = new TurfLineStringComponent();

  const editor = new Rete.NodeEditor('demo@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);
  editor.use(ContextMenuPlugin, {
    searchBar: false, // true by default
    // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
    // searchKeep: (title) => true,
    searchKeep: () => true,
    delay: 100,
    allocate(component) {
      console.log('allocate(component)', component);
      return ['Submenu'];
    },
    rename(component) {
      return component.name;
    },
    items: {
      'Click me': () => { console.log('Works!'); },
    },
    nodeItems: {
      'Click me': () => { console.log('Works for node!'); },
      Delete: true, // delete this node
      Clone: true, // clone this node
    },
  });

  const engine = new Rete.Engine('demo@0.1.0');

  [uploadComponent, jsonComponent, transformComponent, transformEvalComponent,
    concatComponent, previewComponent, csvToJsonComponent, uploadCsvComponent,
    remoteDataComponent, mapComponent, mapMarkersComponent, mapGeoJsonComponent, mapLayerComponent,
    authComponent, turfLineStringComponent,
  ].forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  const localData = localStorage.getItem('node-map');
  if (localData) {
    console.debug('load data from local', JSON.parse(localData));
    await editor.fromJSON(JSON.parse(localData));
  } else {
    createSampleNodes(editor, {
      uploadComponent,
      jsonComponent,
      transformComponent,
      transformEvalComponent,
      concatComponent,
      previewComponent,
    });
  }

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log('process', editor.toJSON());
      await engine.abort();
      await engine.process(editor.toJSON());
    },
  );

  editor.on(
    'process nodecreated nodedraged noderemoved connectioncreated connectionremoved',
    async () => {
      const data = JSON.stringify(editor.toJSON());
      console.debug('Save data to local:', editor.toJSON());
      localStorage.setItem('node-map', data);
    },
  );

  editor.view.resize();
  editor.trigger('process');
  AreaPlugin.zoomAt(editor, editor.nodes);

  return editor;
}

export function useRete() {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container).then((value) => {
        console.log('created');
        editorRef.current = value;
      });
    }
  }, [container]);

  useEffect(
    () => () => {
      if (editorRef.current) {
        console.log('destroy');
        editorRef.current.destroy();
      }
    },
    [],
  );

  return [setContainer];
}
