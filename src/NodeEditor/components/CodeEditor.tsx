import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import ReactJson from 'react-json-view';

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
            <ReactSimpleCodeEditor code={code} onChange={onChange} />
            <br />
          </Col>
          <Col span={8}>
            {errMsg}
            {result && <ReactJson src={JSON.parse(result)} />}
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
