import React from 'react';
import { Col, InputNumber, Row } from 'antd';

export default function LineDashArrayField({
  label,
  min,
  value,
  onChange,
  visible,
  disabled,
}: {
  label: string;
  min: number;
  value: number[];
  onChange: (value: number[] | null) => void;
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
          style={{ width: 50 }}
          min={min}
          disabled={disabled}
          value={value[0]}
          onChange={(v) => {
            if (v === null) {
              return;
            }
            onChange([v, value[1]]);
          }}
          onPointerDown={(e) => {
            // When selecting text in input box, the node should not move
            e.stopPropagation();
          }}
          onDoubleClick={(e) => {
            // When double clicking in this text box, the node should not move
            e.stopPropagation();
          }}
        />
        <InputNumber
          size="small"
          style={{ width: 50 }}
          min={min}
          disabled={disabled}
          value={value[1]}
          onChange={(v) => {
            if (v === null) {
              return;
            }
            onChange([value[0], v]);
          }}
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

LineDashArrayField.defaultProps = {
  visible: true,
  disabled: false,
};
