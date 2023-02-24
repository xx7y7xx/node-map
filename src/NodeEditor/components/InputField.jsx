import React from 'react';
import { Input } from 'antd';

export default function InputField({
  label, value, onChange, visible, disabled,
}) {
  if (!visible) {
    return null;
  }
  return (
    <div>
      <span>{label}</span>
      <Input
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPointerDown={(e) => {
          // When selecting text in input box, the node should not move
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          // When double clicking in this text box, the node should not move
          e.stopPropagation();
        }}
      />
    </div>
  );
}

InputField.defaultProps = {
  visible: true,
  disabled: false,
};
