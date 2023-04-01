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
  const es = ['Display a web map using an alternate projection', 'Add a line to a map using a GeoJSON source', 'Create and style clusters'];
  return (
    <Modal title="Example Modal" open={open} onOk={onOk} onCancel={onCancel}>
      <Row>
        {Object.keys(examples).map((e) => {
          if (typeof examples[e] !== 'object') {
            return <Col key={e} span={6}><button type="button" onClick={handleExample(e)}>{ e}</button></Col>;
          }
          return (
            <Col key={e} span={6}>
              <button type="button" onClick={handleExample(e)}>{e}</button>
              <a href={examples[e].link}>Example Link</a>
            </Col>
          );
        })}
      </Row>
    </Modal>

  );
}

export default ExampleModal;
