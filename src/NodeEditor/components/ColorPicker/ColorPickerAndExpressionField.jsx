import React from 'react';
import { Col, Row } from 'antd';

import ExpressionEditor from '../ExpressionEditor';
import ColorPicker from '.';

export default function ColorPickerAndExpressionField({
  label, defaultValue, value, onChange,
}) {
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={23}><ColorPicker label={label} value={value} onChange={onChange} /></Col>
      <Col span={1}><ExpressionEditor defaultValue={defaultValue} onChange={onChange} /></Col>
    </Row>
  );
}
