import React, { useState } from 'react';
import { Button, Modal } from 'antd';

import ReactSimpleCodeEditor from './ReactSimpleCodeEditor';

export default function JsonEditor({ value = '', onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Open JSON Editor
      </Button>
      <Modal title="JSON Editor" width={800} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {/* <textarea
        rows={5}
        cols={40}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPointerDown={(e) => {
          // When drag slider, the node should not move
          e.stopPropagation();
        }}
      /> */}
        <ReactSimpleCodeEditor code={value} onChange={onChange} />
      </Modal>
    </div>

  );
}
