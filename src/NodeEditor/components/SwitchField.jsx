import React from 'react';
import { Col, Switch, Row } from 'antd';

export default function InputNumberField({
  label, checked, onChange, visible, disabled,
}) {
  if (!visible) {
    return null;
  }
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={12} style={{ lineHeight: '24px' }}>{label}</Col>
      <Col span={12}>
        <Switch
          size="small"
          disabled={disabled}
          checked={checked}
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
