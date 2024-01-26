import React from 'react';
import { Col, Input, Row, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  disabled: boolean;
  // Show tooltip when hovering on label
  tooltip?: string;
};

export default function InputField({
  label,
  value,
  onChange,
  visible,
  disabled,
  tooltip,
}: InputFieldProps) {
  if (!visible) {
    return null;
  }
  return (
    <Row style={{ margin: '4px 0px' }}>
      <Col span={12} style={{ lineHeight: '24px' }}>
        {label}{' '}
        {tooltip && (
          <Tooltip title={tooltip}>
            <QuestionCircleOutlined />
          </Tooltip>
        )}
      </Col>
      <Col span={12}>
        <Input
          size="small"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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

InputField.defaultProps = {
  visible: true,
  disabled: false,
};
