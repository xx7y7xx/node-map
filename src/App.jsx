import React from 'react';

import NodeEditor from './NodeEditor';
import Map from './map';
import Faq from './Faq';
import './App.css';

function App() {
  return (
    <div className="app">
      <Map />
      <NodeEditor />
      <Faq />
    </div>
  );
}

export default App;
