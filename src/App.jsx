import React from 'react';
import './App.css';

import Map from './Map';
import NodeEditor from './NodeEditor';

function App() {
  return (
    <div className="app">
      <NodeEditor />
      <Map />
    </div>
  );
}

export default App;
