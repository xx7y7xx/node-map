import React from 'react';

import { Col, Modal, Row } from 'antd';
import examples from 'NodeEditor/examples';
import { clearEditorAndMap } from 'NodeEditor/helpers';

function ExampleModal({ open, onOk, onCancel }) {
  const handleExample = (example) => () => {
    if (window.confirm('Are you sure to clear all data?') !== true) { // eslint-disable-line no-alert
      return;
    }
    clearEditorAndMap(); // clear all content on map and editor
    examples[example](); // load the data from example to map and editor
    onOk(); // hide modal
  };
  return (
    <Modal title="Example Modal" open={open} onOk={onOk} onCancel={onCancel}>
      <Row>
        <Col span={6}><button type="button" onClick={handleExample('simple')}>Example 1</button></Col>
        <Col span={6}><button type="button" onClick={handleExample('lineString')}>Line String</button></Col>
      </Row>
    </Modal>

  );
}

export default ExampleModal;
