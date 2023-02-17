import React from 'react';
import { Input } from 'antd';

export default function InputField({ label, value, onChange }) {
  return (
    <div>
      <span>{label}</span>
      <Input
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
