import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import JsonView from '@uiw/react-json-view';

import ReactSimpleCodeEditor from './ReactSimpleCodeEditor';

type PropsType = {
  code: string;
  onChange: (code: string) => void;
  errMsg: string;
  result: string;
};

export default function CodeEditor({
  code,
  onChange,
  errMsg,
  result,
}: PropsType) {
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
        Open Code Editor
      </Button>
      <Modal
        title="Code Editor"
        width={1200}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Row>
          <Col span={16}>
            <code>{`function run(input: any) {`}</code>
            <div style={{ marginLeft: 10 }}>
              <ReactSimpleCodeEditor code={code} onChange={onChange} />
            </div>
            <code>{`}`}</code>
          </Col>
          <Col span={8}>
            <b>Error</b>: {errMsg || 'No Error'}
            <br />
            <b>Return result</b>:
            {result && <JsonView value={JSON.parse(result)} />}
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
