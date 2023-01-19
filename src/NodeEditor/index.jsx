/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions */

import React from 'react';
import { Dropdown, Space } from 'antd';
import {
  DownOutlined, ExportOutlined, ImportOutlined, FolderOpenOutlined,
} from '@ant-design/icons';

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
    const date = new Date().toISOString().slice(0, 10);
    downloadObjectAsJson(JSON.stringify(JSON.parse(localStorage.getItem(LS_KEY_NODE_EDITOR_DATA)), null, '  '), `node-map-export-data-${date}.json`);
  };

  const handleLoadExample = () => {
    createSampleNodes();
  };

  const handleSwitchLightDark = () => {
    document.body.classList.toggle('nm-dark-mode');
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
      key: 'import',
      label: (
        <label htmlFor="import-config-file">
          Import
          <input
            type="file"
            id="import-config-file"
            style={{
              visibility: 'hidden',
            }}
            onChange={() => {
              const fr = new FileReader();
              fr.onload = (e) => {
                localStorage.setItem(LS_KEY_NODE_EDITOR_DATA, JSON.stringify(JSON.parse(e.target.result)));
                window.location.reload();
              };
              fr.readAsText(document.getElementById('import-config-file').files[0]);
            }}
          />
        </label>
      ),
      icon: <ImportOutlined />,
    },
    {
      key: 'load-example',
      label: (
        <a onClick={handleLoadExample}>
          Load Example
        </a>
      ),
      icon: <FolderOpenOutlined />,
    }, {
      key: 'switch-light-dark',
      label: (
        <a onClick={handleSwitchLightDark}>
          Switch Light Dark
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
