/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions */

import React from 'react';
import { Dropdown, Space } from 'antd';
import { DownOutlined, ExportOutlined, FolderOpenOutlined } from '@ant-design/icons';

import { useRete } from './rete';
import { LS_KEY_NODE_EDITOR_DATA } from '../constants';
import { createSampleNodes } from './helpers';

function downloadObjectAsJson(exportJsonString, exportName) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(exportJsonString)}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export default function NodeEditor() {
  const [setContainer] = useRete();

  const handleClick = () => {
    downloadObjectAsJson(JSON.stringify(JSON.parse(localStorage.getItem(LS_KEY_NODE_EDITOR_DATA)), null, '  '), 'node-map-export-data.json');
  };

  const handleLoadExample = () => {
    createSampleNodes();
  };

  const items = [
    {
      key: 'export',
      label: (
        <a onClick={handleClick}>
          Export
        </a>
      ),
      icon: <ExportOutlined />,
    },
    {
      key: 'load-example',
      label: (
        <a onClick={handleLoadExample}>
          Load Example
        </a>
      ),
      icon: <FolderOpenOutlined />,
    },
  ];

  return (
    <div className="node-editor">
      <div
        ref={(ref) => ref && setContainer(ref)}
      />

      <div className="nm-export-btn">
        <Dropdown
          menu={{ items }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Menu
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
