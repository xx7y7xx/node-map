import { Col, Modal, Row } from 'antd';
import React from 'react';

import { createSampleNodesV2 } from '../helpers';

function ExampleModal({ open, onOk, onCancel }) {
  const handleClick = () => {
    createSampleNodesV2();
  };
  return (
    <Modal title="Example Modal" open={open} onOk={onOk} onCancel={onCancel}>
      <Row>
        <Col span={6}><button type="button" onClick={handleClick}>Example 1</button></Col>
      </Row>
    </Modal>

  );
}

export default ExampleModal;
