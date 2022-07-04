import React from 'react';
import NodeEditor from './NodeEditor';
import Map from './map';
import './App.css';

function App() {
  return (
    <div className="app">
      <Map />
      <NodeEditor />
    </div>
  );
}

export default App;
