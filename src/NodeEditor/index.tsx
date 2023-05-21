import React, { CSSProperties } from 'react';

import Faq from './components/Faq';
import { useRete } from './rete';
import MenuDropdown from './components/MenuDropdown';

// eslint-disable-next-line react/prop-types
export default function NodeEditor({ style }: { style: CSSProperties }) {
  const [setContainer] = useRete();

  return (
    <div className="nm-node-editor" style={style}>
      <div
        className="nm-node-editor-container"
        ref={(ref) => ref && setContainer(ref)}
        style={{
          width: style.width, // eslint-disable-line react/prop-types
        }}
      />
      <MenuDropdown />
      <Faq />
    </div>
  );
}
