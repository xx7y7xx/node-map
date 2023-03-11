import Rete from 'rete';
import * as turf from '@turf/turf';

import { objectSocket } from './JsonComponent';
import { stringSocket } from './UploadCsvComponent';
import InputControl from './InputControl';
import { genSourceId } from './helpers';

const KEY = 'GeoJSONSource';
export const INPUT_KEY = 'json';
export const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';
export const OUTPUT_KEY = 'sourceId';

/**
 * API - https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource
 * Input1: GeoJSON
 * Input2: URL
 * Output: sourceId
 *
 * The data stored in this node
 * ```json
 * {
 *   "<CONTROL_KEY_SOURCE_ID>": "sourceId123"
 * }
 * ```
 */
export default class GeoJSONSourceComponent extends Rete.Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  builder(node) {
    console.debug('GeoJSONSourceComponent builder', node);
    if (!this.nodeIdMap) this.nodeIdMap = {};
    this.nodeIdMap[node.id] = node;

    const input = new Rete.Input(INPUT_KEY, 'GeoJSON', objectSocket);
    const output = new Rete.Output(OUTPUT_KEY, 'sourceId', stringSocket);

    node
      .addInput(input)
      .addOutput(output)
      .addControl(new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, { label: 'sourceId' }));

    // Initial the source ID input box with value
    if (this.getSourceId(node) === null || this.getSourceId(node) === undefined) {
      this.setSourceId(node, genSourceId());
    }

    window.mapbox.on('sourcedata', (e) => {
      if (e.sourceId !== this.getSourceId(node) || !e.isSourceLoaded) return;
      const fs = window.mapbox.querySourceFeatures(this.getSourceId(node));
      if (fs.length === 0) return;
      console.debug('zoom to features', fs);
      const bbox = turf.bbox({
        type: 'FeatureCollection',
        features: fs,
      });
      window.mapbox.fitBounds(bbox, { padding: 20 });
    });

    return node;
  }

  getSourceId(node) {
    return this.nodeIdMap[node.id].data[CONTROL_KEY_SOURCE_ID];
  }

  setSourceId(node, val) {
    this.nodeIdMap[node.id].data[CONTROL_KEY_SOURCE_ID] = val;
  }

  worker(node, inputs, outputs) {
    console.debug('GeoJSONSourceComponent worker', node, inputs, outputs);
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    const geojson = inputs[INPUT_KEY][0];

    if (!geojson) {
      // no data input, maybe link disconnect
      return;
    }

    outputs[OUTPUT_KEY] = this.getSourceId(node);

    this.addOrUpdateSource(geojson, node);
  }

  addOrUpdateSource(geojson, node) {
    console.debug('GeoJSONSourceComponent addOrUpdateSource', geojson, node);
    const map = window.mapbox;

    const sourceData = {
      type: 'geojson',
      data: geojson,
    };

    const mpSource = map.getSource(this.getSourceId(node));
    if (mpSource) {
      // some layers may use this source now
      // map.removeSource(this.getSourceId(node));
      map.getSource(this.getSourceId(node)).setData(sourceData.data);
    } else {
      window.mapbox.addSource(this.getSourceId(node), sourceData);
    }
  }
}
