import React, { useRef, useState } from 'react';

import { handlerWidth } from './constants';
import NodeEditor from './NodeEditor';
import Map from './map';
import './App.css';

function App() {
  const layoutRef = useRef();
  const [leftWidth, setLeftWidth] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const mouseMoveHandler = (e) => {
    if (!isMouseDown) return;

    document.body.style.cursor = 'col-resize';

    // How far the mouse has been moved
    setLeftWidth(e.clientX);
  };

  const mouseUpHandler = () => {
    setIsMouseDown(false);
    document.body.style.removeProperty('cursor');
  };

  const mouseDownHandler = () => {
    setIsMouseDown(true);
  };

  let rightWidth = 0;
  if (layoutRef.current && leftWidth !== 0) {
    rightWidth = layoutRef.current.getBoundingClientRect().width - leftWidth - handlerWidth;
  }

  return (
    <div
      aria-hidden
      className="nm-app"
      ref={layoutRef}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
    >
      <Map width={leftWidth} />
      <div
        aria-hidden
        className="nm-layout-resizer"
        style={{ width: handlerWidth }}
        onMouseDown={mouseDownHandler}
      />
      <NodeEditor style={{ width: rightWidth }} />
    </div>
  );
}

export default App;
