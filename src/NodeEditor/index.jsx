import React from 'react';
import { useRete } from './rete';

export default function App() {
  const [setContainer] = useRete();
  return (
    <div className="App">
      <div
        style={{
          width: '100vw',
          height: '100vh',
        }}
        ref={(ref) => ref && setContainer(ref)}
      />
    </div>
  );
}
