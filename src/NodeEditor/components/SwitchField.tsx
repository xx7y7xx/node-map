import React from 'react';
import { Col, Switch, Row } from 'antd';

export default function SwitchField({
  label,
  checked,
  onChange,
  visible,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
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
        <Switch
          size="small"
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          // @ts-ignore
          onPointerDown={(e) => {
            // When selecting text in input box, the node should not move
            e.stopPropagation();
          }}
          onDoubleClick={(e: Event) => {
            // When double clicking in this text box, the node should not move
            e.stopPropagation();
          }}
        />
      </Col>
    </Row>
  );
}

SwitchField.defaultProps = {
  visible: true,
  disabled: false,
};
