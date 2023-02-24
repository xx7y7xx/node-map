import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import ColorPicker from './ColorPicker';
import NumberSlider from './NumberSlider';
import InputField from './InputField';

/**
 *
 * @param {*} props
 * @param {string} props.sourceId This is readonly, generated from MapLayerV2Component
 * @returns
 */
export default function MapLayerConfigDrawer({ sourceId, defaultValue, onChange }) {
  const [open, setOpen] = useState(false);
  const [lineColor, setLineColor] = useState(/* #000 */defaultValue.lineColor);
  const [lineWidth, setLineWidth] = useState(/* 1 */defaultValue.lineWidth);
  const [colorBaseOnField, setColorBaseOnField] = useState(/* '' */defaultValue.colorBaseOnField);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (key) => (val) => {
    onChange(key, val);

    switch (key) {
      case 'lineColor': setLineColor(val); break;
      case 'lineWidth': setLineWidth(val); break;
      case 'colorBaseOnField': setColorBaseOnField(val); break;
      default:
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Layer Config
      </Button>
      <Drawer title="Layer Config Drawer" placement="right" onClose={onClose} open={open}>
        <span>
          <b>sourceId:</b>
          {' '}
          {sourceId}
        </span>
        <ColorPicker
          label="Color"
          value={lineColor}
          onChange={handleChange('lineColor')}
        />
        <NumberSlider label="Line Width" value={lineWidth} onChange={handleChange('lineWidth')} />
        <InputField label="Color Base On Field" value={colorBaseOnField} onChange={handleChange('colorBaseOnField')} />

      </Drawer>
    </>
  );
}
