import React, { CSSProperties } from 'react';
import { Col, Row, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

export default function SelectField({
  label,
  style,
  options,
  value,
  onChange,
  visible,
  disabled,
  ...selectProps
}: {
  label: string;
  style: CSSProperties;
  options: DefaultOptionType[];
  value: string;
  onChange: (value: string) => void;
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
        <Select
          size="small"
          style={{ width: 150, ...style }}
          disabled={disabled}
          options={options}
          value={value}
          onChange={onChange}
          // @ts-ignore
          onPointerDown={(e) => {
            // When selecting text in input box, the node should not move
            e.stopPropagation();
          }}
          // @ts-ignore
          onDoubleClick={(e) => {
            // When double clicking in this text box, the node should not move
            e.stopPropagation();
          }}
          {...selectProps}
        />
      </Col>
    </Row>
  );
}

SelectField.defaultProps = {
  visible: true,
  disabled: false,
};
