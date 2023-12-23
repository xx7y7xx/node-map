// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import ColorPicker from './ColorPicker';
import NumberSlider from './NumberSlider';
import InputField from './InputField';

export const MODAL = 'modal';
export const INLINE = 'inline';

/**
 * A layer config panel for mapbox line type layer
 *
 * @param {*} props
 * @param {('modal'|'inline')} props.mode Default is "modal", will show a button, and click to show modal, another is "inline", will show all input box in node directly
 * @param {string} props.sourceId This is readonly, generated from MapSourceAndLayerV3Component
 * @returns
 */
export default function MapLayerConfigDrawer({
  mode = MODAL,
  visible,
  sourceId,
  defaultValue,
  onChange,
  onCleanup,
}) {
  const [open, setOpen] = useState(false);
  const [lineColor, setLineColor] = useState(/* #000 */ defaultValue.lineColor);
  const [lineWidth, setLineWidth] = useState(/* 1 */ defaultValue.lineWidth);
  const [colorBaseOnField, setColorBaseOnField] = useState(
    /* '' */ defaultValue.colorBaseOnField,
  );

  /**
   * Why react hot reload not call this?
   *
   * This should be called to remove mapbox layers created by MapControl,
   * and prevent error of calling addSource same id more than once.
   *
   * But because this cannot be called, so use another way in rete.jsx:useRete to do clean work
   */
  useEffect(() => {
    console.log('MapLayerConfigDrawer useEffect');
    // Specify how to clean up after this effect:
    return function cleanup() {
      console.log('MapLayerConfigDrawer useEffect cleanup');
      onCleanup();
    };
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (key) => (val) => {
    onChange(key, val);

    switch (key) {
      case 'lineColor':
        setLineColor(val);
        break;
      case 'lineWidth':
        setLineWidth(val);
        break;
      case 'colorBaseOnField':
        setColorBaseOnField(val);
        break;
      default:
    }
  };

  if (!visible) return null;

  const controls = (
    <>
      <span>
        <b>sourceId:</b> {sourceId}
      </span>
      <ColorPicker
        label="Color"
        value={lineColor}
        onChange={handleChange('lineColor')}
      />
      <NumberSlider
        label="Line Width"
        value={lineWidth}
        onChange={handleChange('lineWidth')}
      />
      <InputField
        label="Color Base On Field"
        value={colorBaseOnField}
        onChange={handleChange('colorBaseOnField')}
      />
    </>
  );

  if (mode === INLINE) {
    return controls;
  }

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Layer Config
      </Button>
      <Drawer
        title="Layer Config Drawer"
        placement="right"
        onClose={onClose}
        open={open}>
        {controls}
      </Drawer>
    </>
  );
}

MapLayerConfigDrawer.defaultProps = {
  visible: true,
};
