import React from 'react';
import { Slider, InputNumber } from 'antd';

export default function NumberSlider({ label, value, onChange }) {
  return (
    <div onPointerDown={(e) => {
      // When drag slider, the node should not move
      e.stopPropagation();
    }}
    >
      <span>{label}</span>
      <Slider
        min={1}
        max={20}
        defaultValue={1}
        value={value}
        onChange={(val) => onChange(val)}
      />
      <InputNumber
        value={value}
        onChange={(val) => onChange(val)}
      />
    </div>
  );
}
