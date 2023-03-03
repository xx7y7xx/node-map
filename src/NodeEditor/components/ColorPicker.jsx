import React from 'react';
import { Col, Input, Row } from 'antd';

export default function ColorPicker({ label, value, onChange }) {
  return (
    <Row style={{
      margin: '4px 0px',
    }}
    >
      <Col span={8} style={{ lineHeight: '24px' }}>{label}</Col>
      <Col span={16}><Input size="small" type="color" value={value} onChange={(e) => onChange(e.target.value)} /></Col>
    </Row>
  );
}
