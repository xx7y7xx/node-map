import React from 'react';
import { Col, Row, Select } from 'antd';

export default function SelectField({
  label, style, options, value, onChange, visible, disabled,
}) {
  if (!visible) {
    return null;
  }
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={12} style={{ lineHeight: '24px' }}>{label}</Col>
      <Col span={12}>
        <Select
          size="small"
          style={style}
          disabled={disabled}
          options={options}
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

SelectField.defaultProps = {
  visible: true,
  disabled: false,
};
