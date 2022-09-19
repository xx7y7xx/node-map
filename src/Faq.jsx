import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import PubSub from 'pubsub-js';
import Markdown from 'markdown-to-jsx';

const TransformEvalFaq = require('./NodeEditor/TransformEvalFaq.md');
const PreviewFaq = require('./NodeEditor/PreviewFaq.md');

const markdownStringMap = {
  TransformEvalFaq,
  PreviewFaq,
};

function Faq() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  useEffect(() => {
    PubSub.subscribe('OPEN_FAQ', (msg, data) => {
      setVisible(data);
    });
    PubSub.subscribe('SET_FAQ_PATH', (msg, data) => {
      const file = markdownStringMap[data];
      if (!file) {
        setContent(`FAQ markdown not found, ${data}.md needed`);
        return;
      }
      fetch(file)
        .then((response) => response.text())
        .then((text) => {
          setContent(text);
        });
    });
  }, []);
  return (
    <div>
      <Drawer
        title="FAQ"
        placement="right"
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <Markdown>{content}</Markdown>
      </Drawer>
    </div>
  );
}

export default Faq;
