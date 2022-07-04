import React from 'react';
import { useRete } from './rete';

export default function NodeEditor() {
  const [setContainer] = useRete();
  return (
    <div className="node-editor">
      <div
        ref={(ref) => ref && setContainer(ref)}
      />
    </div>
  );
}
