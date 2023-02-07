import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const { TextArea } = Input;

export default function AntdTextArea({
  code, onChange,
}) {
  return (
    <TextArea
      style={{ fontFamily: 'monospace' }}
      rows={6}
      cols={80}
      value={code}
      onChange={(e) => onChange(e.target.value)}
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

AntdTextArea.propTypes = {
  code: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
