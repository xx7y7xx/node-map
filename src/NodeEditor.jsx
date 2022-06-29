import React, { useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { Input } from 'antd';

import {
  nodes as initialNodes,
  edges as initialEdges,
} from './initial-elements';

export default function NodeEditor() {
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  const handleAddNode = () => {
    setNodes((oldNodes) => [
      ...oldNodes,
      {
        id: 'transform',
        // type: "input",
        data: {
          label: (
            <div>
              Latitude:
              {' '}
              <Input value={lat} onChange={(evt) => setLat(evt.target.value)} />
              <br />
              Longitude:
              {' '}
              <Input value={lng} onChange={(evt) => setLng(evt.target.value)} />
              <br />
            </div>
          ),
        },
        position: { x: 0, y: 100 },
      },
    ]);
  };
  const handleGenerate = () => {
    const outputLine = edges.find((e) => e.target === 'output');
    if (outputLine) {
      const id = outputLine.source;
      const transformNode = nodes.find((n) => n.id === id);
      if (transformNode) {
        console.log('found transform node', transformNode);
      }
    }
  };
  return (
    <div className="node-editor">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
      <div className="action-buttons">
        <button onClick={handleAddNode}>Add Node</button>
        <button onClick={handleGenerate}>Generate</button>
      </div>
    </div>
  );
}
