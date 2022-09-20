import React from 'react';

import { useRete } from './rete';
import { LS_KEY_NODE_EDITOR_DATA } from '../constants';

function downloadObjectAsJson(exportJsonString, exportName) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(exportJsonString)}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export default function NodeEditor() {
  const [setContainer] = useRete();
  const handleClick = () => {
    downloadObjectAsJson(localStorage.getItem(LS_KEY_NODE_EDITOR_DATA), 'node-map-export-data.json');
  };
  return (
    <div className="node-editor">
      <div
        ref={(ref) => ref && setContainer(ref)}
      />
      <button className="nm-export-btn" type="button" onClick={handleClick}>Export</button>
    </div>
  );
}
