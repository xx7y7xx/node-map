import React from 'react';

import { Col, Modal, Row } from 'antd';
import examples from 'NodeEditor/examples';
import { clearEditorAndMap } from 'NodeEditor/helpers';

function ExampleModal({ open, onOk, onCancel }) {
  const handleExample = (example) => () => {
    if (window.confirm('Are you sure to clear all data?') !== true) { // eslint-disable-line no-alert
      return;
    }
    clearEditorAndMap(); // clear all content on map and editor
    examples[example](); // load the data from example to map and editor
    onOk(); // hide modal
  };
  return (
    <Modal title="Example Modal" open={open} onOk={onOk} onCancel={onCancel}>
      <Row>
        <Col span={6}><button type="button" onClick={handleExample('simple')}>Example 1</button></Col>
        <Col span={6}><button type="button" onClick={handleExample('Display a web map using an alternate projection')}>Display a web map using an alternate projection</button></Col>
        <Col span={6}><button type="button" onClick={handleExample('Add a line to a map using a GeoJSON source')}>Add a line to a map using a GeoJSON source</button></Col>
        <Col span={6}>
          <button type="button" onClick={handleExample('Add a polygon to a map using a GeoJSON source')}>Add a polygon to a map using a GeoJSON source</button>
          <a href="https://docs.mapbox.com/mapbox-gl-js/example/geojson-polygon/">Example Link</a>
        </Col>
      </Row>
    </Modal>

  );
}

export default ExampleModal;
