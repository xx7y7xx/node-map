import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import PubSub from 'pubsub-js';

function Faq() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(null);
  useEffect(() => {
    PubSub.subscribe('OPEN_FAQ', (msg, data) => {
      setVisible(data);
    });
    PubSub.subscribe('SET_FAQ_CONTENT', (msg, data) => {
      setContent(data);
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
        {content}
      </Drawer>
    </div>
  );
}

export default Faq;
