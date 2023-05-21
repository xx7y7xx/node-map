import React from 'react';
import { Col, Row } from 'antd';
import ExpressionEditor from './ExpressionEditor';

export default function ExpressionField({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue: any;
  onChange: (value: string) => void;
}) {
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={12} style={{ lineHeight: '24px' }}>
        {label}
      </Col>
      <Col span={12}>
        <ExpressionEditor defaultValue={defaultValue} onChange={onChange} />
      </Col>
    </Row>
  );
}
