import { Col, Modal, Row } from 'antd';
import jsonNodeExample from 'NodeEditor/examples/jsonNode';
import React from 'react';

function ExampleModal({ open, onOk, onCancel }) {
  const handleClick = () => {
    jsonNodeExample();
    onOk();
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
