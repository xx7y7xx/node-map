import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Input, Modal } from 'antd';

function RequestHeaders({ value, onChange }) {
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
    <>
      <Button onClick={showModal}>
        Headers
      </Button>
      <Modal title="Headers" width={1200} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input.TextArea
          style={{ fontFamily: 'monospace' }}
          rows={20}
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
      </Modal>
    </>
  );
}

RequestHeaders.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RequestHeaders;
