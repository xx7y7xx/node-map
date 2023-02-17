import React from 'react';
import { Input } from 'antd';

export default function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <span>{label}</span>
      <Input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
