declare module 'rete-react-render-plugin' {
  import { Control, Input, Node, NodeEditor, Output } from 'rete';

  declare var Socket: React$Component;
  declare var Control: React$Component;

  // 定义 Node 组件所需的 prop 类型
  interface NodeProps {
    node: Node;
    editor: NodeEditor;
    bindSocket: any;
    bindControl: any;
  }

  interface NodeState {
    outputs: Output[];
    controls: Control[];
    inputs: Input[];
    selected: any;
  }

  declare class Node extends React.Component<NodeProps, NodeState> {}

  declare var name: string;

  // editor, { component: NodeComponent = Node, createRoot }
  declare var install: any;
}
