// @ts-nocheck

import React, { useState } from 'react';
import { Button, Modal } from 'antd';

import ReactSimpleCodeEditor from './ReactSimpleCodeEditor';

export default function CodeEditor(props) {
  const { code, onChange, errMsg } = props;
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
        width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        {/* <AntdTextArea code={code} onChange={onChange} /> */}
        <ReactSimpleCodeEditor code={code} onChange={onChange} />
        <br />
        {errMsg}
      </Modal>
    </div>
  );
}
