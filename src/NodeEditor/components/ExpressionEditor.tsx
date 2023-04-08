import React, { useState } from 'react';
import { Button, Modal } from 'antd';

import ReactSimpleCodeEditor from './ReactSimpleCodeEditor';

export default function ExpressionEditor({
  defaultValue,
  onChange,
}: {
  defaultValue: any;
  onChange: (value: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valStr, setValStr] = useState(() => {
    if (!defaultValue) return '';
    // `['1']` => "[\"1\"]"
    return JSON.stringify(defaultValue);
  });
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  /**
   *
   * @param {string} val
   */
  const handleChange = (val: string) => {
    setValStr(val);
    try {
      // "['1']" => `['1']`
      onChange(eval(val)); // eslint-disable-line no-eval
    } catch (err) {
      console.error('Failed to convert string to expression', err);
    }
  };
  return (
    <div>
      <Button
        type={valStr ? 'primary' : 'default'}
        size="small"
        onClick={showModal}>
        E
      </Button>
      <Modal
        title="JSON Editor"
        width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <ReactSimpleCodeEditor code={valStr} onChange={handleChange} />
      </Modal>
    </div>
  );
}
