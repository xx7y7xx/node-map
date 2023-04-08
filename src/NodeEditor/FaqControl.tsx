// @ts-nocheck

import React from 'react';
import Rete from 'rete';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';

export default class FaqControl extends Rete.Control {
  static component = ({ content }) => (
    <QuestionCircleOutlined
      onClick={() => {
        PubSub.publish('OPEN_FAQ', true);
        PubSub.publish('SET_FAQ_PATH', { content });
      }}
    />
  );

  /**
   *
   * @param {*} emitter
   * @param {string} key
   * @param {*} node
   * @param {Object} props
   * @param {string} props.content
   */
  constructor(emitter, key, node, props) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = FaqControl.component;

    this.props = props;
  }
}
