import { useState, useEffect, useRef } from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from 'rete-area-plugin';
import MyNode from './MyNode';
import NumControl from './NumControl';
import TextControl from './TextControl';
import NumComponent from './NumComponent';
import TextComponent from './TextComponent';

const numSocket = new Rete.Socket('Number value');
const textSocket = new Rete.Socket('Text value');

class AddComponent extends Rete.Component {
  constructor() {
    super('Add');
    this.data.component = MyNode; // optional
  }

  builder(node) {
    const inp1 = new Rete.Input('num1', 'Number Socket', numSocket);
    const inp2 = new Rete.Input('num2', 'Number Socket 2', numSocket);
    const inp3 = new Rete.Input('text1', 'Text Socket', textSocket);
    const out = new Rete.Output('num', 'Number', numSocket);

    inp1.addControl(new NumControl(this.editor, 'num1', node));
    inp2.addControl(new NumControl(this.editor, 'num2', node));
    inp3.addControl(new TextControl(this.editor, 'text1', node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addControl(new TextControl(this.editor, 'preview', node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs.num1.length ? inputs.num1[0] : node.data.num1;
    const n2 = inputs.num2.length ? inputs.num2[0] : node.data.num2;
    const n3 = inputs.text1.length ? inputs.text1[0] : node.data.text1;
    const sum = n1 + n2;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get('preview')
      .setValue(`${sum}|${n3}`);
    outputs.num = sum; // eslint-disable-line no-param-reassign
  }
}

export async function createEditor(container) {
  const components = [
    new NumComponent(),
    new AddComponent(),
    new TextComponent(),
  ];

  const editor = new Rete.NodeEditor('demo@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  const engine = new Rete.Engine('demo@0.1.0');

  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  const n1 = await components[0].createNode({ num: 2 });
  const n2 = await components[0].createNode({ num: 3 });
  const n3 = await components[2].createNode({ text: 'foo' });
  const addNode = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  n3.position = [80, 600];
  addNode.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(n3);
  editor.addNode(addNode);

  editor.connect(n1.outputs.get('num'), addNode.inputs.get('num1'));
  editor.connect(n2.outputs.get('num'), addNode.inputs.get('num2'));
  editor.connect(n3.outputs.get('text'), addNode.inputs.get('text1'));

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log('process');
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

  useEffect(() => () => {
    if (editorRef.current) {
      console.log('destroy');
      editorRef.current.destroy();
    }
  }, []);

  return [setContainer];
}
