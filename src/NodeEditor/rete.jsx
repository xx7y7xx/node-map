import { useState, useEffect, useRef } from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from 'rete-area-plugin';
import JsonComponent from './JsonComponent';
import TransformComponent from './TransformComponent';
import PreviewComponent from './PreviewComponent';
import mockJsonData from './mockData.json';

export async function createEditor(container) {
  const jsonComponent = new JsonComponent();
  const transformComponent = new TransformComponent();
  const previewComponent = new PreviewComponent();

  const editor = new Rete.NodeEditor('demo@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  const engine = new Rete.Engine('demo@0.1.0');

  [jsonComponent, transformComponent, previewComponent].forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  const jsonNode = await jsonComponent.createNode({
    json: mockJsonData,
  });
  const transformNode = await transformComponent.createNode();
  const previewNode = await previewComponent.createNode();

  jsonNode.position = [0, 0];
  transformNode.position = [400, 100];
  previewNode.position = [700, 0];

  editor.addNode(jsonNode);
  editor.addNode(transformNode);
  editor.addNode(previewNode);

  editor.connect(
    jsonNode.outputs.get('json'),
    transformNode.inputs.get('json'),
  );
  editor.connect(
    transformNode.outputs.get('json'),
    previewNode.inputs.get('json'),
  );

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log('process', editor.toJSON());
      await engine.abort();
      await engine.process(editor.toJSON());
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
