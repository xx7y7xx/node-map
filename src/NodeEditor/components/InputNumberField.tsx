import React from 'react';
import { Col, InputNumber, Row } from 'antd';

export default function InputNumberField({
  label,
  min,
  value,
  onChange,
  visible,
  disabled,
}: {
  label: string;
  min: number;
  value: number;
  onChange: (value: number | null) => void;
  visible: boolean;
  disabled: boolean;
}) {
  if (!visible) {
    return null;
  }
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={12} style={{ lineHeight: '24px' }}>
        {label}
      </Col>
      <Col span={12}>
        <InputNumber
          size="small"
          min={min}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onPointerDown={(e) => {
            // When selecting text in input box, the node should not move
            e.stopPropagation();
          }}
          onDoubleClick={(e) => {
            // When double clicking in this text box, the node should not move
            e.stopPropagation();
          }}
        />
      </Col>
    </Row>
  );
}

InputNumberField.defaultProps = {
  visible: true,
  disabled: false,
};
