import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import ColorPicker from './ColorPicker';
import NumberSlider from './NumberSlider';
import InputField from './InputField';

export default function MapLayerConfigDrawer({ defaultValue, onChange }) {
  const [open, setOpen] = useState(false);
  const [lineColor, setLineColor] = useState(defaultValue.lineColor);
  const [lineWidth, setLineWidth] = useState(1);
  const [colorBaseOnField, setColorBaseOnField] = useState('');
  const [sourceId, setSourceId] = useState('');

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Layer Config
      </Button>
      <Drawer title="Layer Config Drawer" placement="right" onClose={onClose} open={open}>
        <ColorPicker
          label="Color"
          value={lineColor}
          onChange={(val) => {
            setLineColor(val);
            onChange('lineColor', val);
          }}
        />
        <NumberSlider label="Line Width" value={lineWidth} onChange={setLineWidth} />
        <InputField label="Color Base On Field" value={colorBaseOnField} onChange={setColorBaseOnField} />
        <InputField label="Source ID" value={sourceId} onChange={setSourceId} />
      </Drawer>
    </>
  );
}
