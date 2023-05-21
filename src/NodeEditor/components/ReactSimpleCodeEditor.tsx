import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; // Example style, you can use another

export default function ReactSimpleCodeEditor({
  code,
  onChange,
}: {
  code: string;
  onChange: (code: string) => void;
}) {
  return (
    <Editor
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: '12px',
        height: '50em',
        width: '60em',
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
