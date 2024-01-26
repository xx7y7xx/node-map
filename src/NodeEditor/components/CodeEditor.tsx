import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import JsonView from '@uiw/react-json-view';
import PubSub from 'pubsub-js';

import faq from '../EvalCodeFaq.md';
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
      <Button type="primary" size="small" onClick={showModal}>
        Open Code Editor
      </Button>
      <Modal
        title={
          <div>
            Code Editor{' '}
            <QuestionCircleOutlined
              onClick={() => {
                PubSub.publish('OPEN_FAQ', true);
                PubSub.publish('SET_FAQ_PATH', { content: faq });
              }}
            />
          </div>
        }
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
