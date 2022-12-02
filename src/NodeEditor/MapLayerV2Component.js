/* eslint-disable no-param-reassign */

import Rete from 'rete';
import * as turf from '@turf/turf';

import { objectSocket } from './JsonComponent';
import ColorPickerControl from './ColorPickerControl';
import SliderControl from './SliderControl';
import InputControl from './InputControl';

// const LAYER_ID = 'nm-line-string-layer';
// const LAYER_ID_POINT = 'nm-point-layer';
const INPUT_KEY = 'geojson';
const CONTROL_KEY_LINE_COLOR = 'controlKeyLineColor';
const CONTROL_KEY_LINE_WIDTH = 'controlKeyLineWidth';
const CONTROL_KEY_GEOJSON = 'controlKeyGeojson';
const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';

// MapLayerV2Component = MapGeoJsonComponent + MapLayerComponent
export default class MapLayerV2Component extends Rete.Component {
  constructor() {
    super('Map Layer V2 Node');

    window.mapbox.on('load', () => {
      this.mapReady = true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  builder(node) {
    const input = new Rete.Input(INPUT_KEY, 'GeoJSON', objectSocket);

    node
      .addInput(input)
      .addControl(new ColorPickerControl(this.editor, CONTROL_KEY_LINE_COLOR, node, { label: 'color' }))
      .addControl(new SliderControl(this.editor, CONTROL_KEY_LINE_WIDTH, node, { label: 'line-width' }))
      // .addControl(new TextControl(this.editor, CONTROL_KEY_GEOJSON, node, true))
      .addControl(new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, { label: 'sourceId' }));

    // Initial the source ID input box with value
    if (!node.data[CONTROL_KEY_SOURCE_ID]) {
      node.data[CONTROL_KEY_SOURCE_ID] = (`sourceId${Math.round(Math.random() * 1000)}`);
    }

    window.mapbox.on('sourcedata', (e) => {
      if (e.sourceId !== node.data[CONTROL_KEY_SOURCE_ID] || !e.isSourceLoaded) return;
      const fs = window.mapbox.querySourceFeatures(node.data[CONTROL_KEY_SOURCE_ID]);
      if (fs.length === 0) return;
      console.debug('zoom to features', fs);
      const bbox = turf.bbox({
        type: 'FeatureCollection',
        features: fs,
      });
      window.mapbox.fitBounds(bbox, { padding: 20 });
    });
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs) {
    // inputs[INPUT_KEY]=[] // no data
    // inputs[INPUT_KEY]=[[[103.8254528,1.2655414]]]
    const geojson = inputs[INPUT_KEY][0];

    if (!geojson) {
      // no data input, maybe link disconnect
      this.updateText(node, '');
      return;
    }

    const sourceId = node.data[CONTROL_KEY_SOURCE_ID];
    const layerId = `${sourceId}layerId`;
    const layerIdPoint = `${sourceId}layerIdPoint`;

    if (this.mapReady) {
      this.addOrUpdateSource(geojson, node);
    } else {
      window.mapbox.on('load', () => {
        this.addOrUpdateSource(geojson, node);
      });
    }

    if (this.mapReady) {
      this.addOrUpdateLayer(sourceId, node);
    } else {
      window.mapbox.on('load', () => {
        this.addOrUpdateLayer(sourceId, node);
      });
    }

    if (!sourceId) {
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getLayer(layerIdPoint)) {
        map.removeLayer(layerIdPoint);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addOrUpdateLayer(sourceId, node) {
    const map = window.mapbox;
    const layerId = `${sourceId}layerId`;
    const layerIdPoint = `${sourceId}layerIdPoint`;

    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'line-color', node.data[CONTROL_KEY_LINE_COLOR]);
      map.setPaintProperty(layerId, 'line-width', node.data[CONTROL_KEY_LINE_WIDTH]);
      map.setPaintProperty(layerIdPoint, 'circle-color', node.data[CONTROL_KEY_LINE_COLOR]);
      map.setPaintProperty(layerIdPoint, 'circle-radius', node.data[CONTROL_KEY_LINE_WIDTH]);
    } else {
      window.mapbox.addLayer({
        // id: LAYER_ID,
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': node.data[CONTROL_KEY_LINE_COLOR],
          'line-width': node.data[CONTROL_KEY_LINE_WIDTH],
        },
      });

      window.mapbox.addLayer({
        // id: LAYER_ID_POINT,
        id: layerIdPoint,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': node.data[CONTROL_KEY_LINE_WIDTH],
          'circle-color': node.data[CONTROL_KEY_LINE_COLOR],
        },
      });
    }
  }

  // update text in preview control
  updateText(node, text) {
    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls
      .get(CONTROL_KEY_GEOJSON)
      ?.setValue(text);
  }

  // eslint-disable-next-line class-methods-use-this
  addOrUpdateSource(geojson, node) {
    const map = window.mapbox;

    const sourceData = {
      type: 'geojson',
      data: geojson,
    };

    this.updateText(node, `${JSON.stringify(sourceData)}`);

    const mpSource = map.getSource(node.data[CONTROL_KEY_SOURCE_ID]);
    if (mpSource) {
      // some layers may use this source now
      // map.removeSource(node.data[CONTROL_KEY_SOURCE_ID]);
      map.getSource(node.data[CONTROL_KEY_SOURCE_ID]).setData(sourceData.data);
    } else {
      window.mapbox.addSource(node.data[CONTROL_KEY_SOURCE_ID], sourceData);
    }
  }
}
