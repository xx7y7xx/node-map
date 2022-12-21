import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; // Example style, you can use another

export default function ReactSimpleCodeEditor({
  code, onChange,
}) {
  return (
    <Editor
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: '12px',
        height: '10em',
        width: '80em',
        backgroundColor: 'white',
      }}
      value={code}
      highlight={(c) => highlight(c, languages.js)}
      padding={10}
      onValueChange={(c) => onChange(c)}
      onPointerDown={(e) => {
        // When selecting in this text box, the node should not move
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        // When double clicking in this text box, the node should not move
        e.stopPropagation();
      }}
    />
  );
}

ReactSimpleCodeEditor.propTypes = {
  code: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
