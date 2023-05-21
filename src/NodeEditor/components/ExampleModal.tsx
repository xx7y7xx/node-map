import React from 'react';

import { Col, Modal, Row } from 'antd';
import examples from 'NodeEditor/examples';
import { clearEditorAndMap } from 'NodeEditor/helpers';

interface ExampleModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

type ExampleNames = keyof typeof examples;

function ExampleModal({ open, onOk, onCancel }: ExampleModalProps) {
  const handleExample = (exampleFn: () => void) => () => {
    if (window.confirm('Are you sure to clear all data?') !== true) {
      // eslint-disable-line no-alert
      return;
    }
    clearEditorAndMap(); // clear all content on map and editor
    exampleFn(); // load the data from example to map and editor
    onOk(); // hide modal
  };
  return (
    <Modal title="Example Modal" open={open} onOk={onOk} onCancel={onCancel}>
      <Row>
        {(Object.keys(examples) as ExampleNames[]).map((e) => {
          return (
            <Col key={e} span={6}>
              <button
                type="button"
                onClick={handleExample(examples[e] as () => void)}>
                {e}
              </button>
            </Col>
          );
        })}
      </Row>
    </Modal>
  );
}

export default ExampleModal;
