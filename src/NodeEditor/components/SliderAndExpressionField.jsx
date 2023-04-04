import React, { useState } from 'react';
import { Row, Col } from 'antd';
import ExpressionEditor from './ExpressionEditor';
import NumberSlider from './NumberSlider';

export default function SliderAndExpression({
  label, min = 1, max = 20, step, defaultNum = 1, defaultValue, value, onChange,
}) {
  const [num, setNum] = useState(defaultNum);
  const handleNumChange = (n) => {
    setNum(n);
    onChange(n);
  };
  /**
   *
   * @param {Object} exp
   */
  const handleExprChange = (exp) => {
    onChange(exp);
  };
  return (
    <Row>
      <Col span={23}>
        <NumberSlider
          min={min}
          max={max}
          step={step}
          label={label}
          value={num}
          onChange={handleNumChange}
        />
      </Col>
      <Col span={1}><ExpressionEditor defaultValue={defaultValue} onChange={handleExprChange} /></Col>
    </Row>
  );
}
