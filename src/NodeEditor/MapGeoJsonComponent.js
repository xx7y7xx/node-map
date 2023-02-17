/* eslint-disable no-param-reassign */

import Rete from 'rete';
import * as turf from '@turf/turf';

// import TextControl from './TextControl';
import { objectSocket } from './JsonComponent';
import { stringSocket } from './UploadCsvComponent';
import ButtonControl from './ButtonControl';
import InputControl from './InputControl';

const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';
const CONTROL_KEY = 'mapGeoJsonControl';
// const SOURCE_ID = 'nm-line-string-source';
const OUTPUT_KEY = 'sourceId';

export default class MapGeoJsonComponent extends Rete.Component {
  constructor() {
    super('Map GeoJSON Node');

    window.mapbox.on('load', () => {
      this.mapReady = true;
    });
  }

  builder(node) {
    if (!this.nodeIdMap) this.nodeIdMap = {};
    this.nodeIdMap[node.id] = node;

    let index = 0;

    const input = new Rete.Input('json', 'GeoJSON', objectSocket);
    const output = new Rete.Output(OUTPUT_KEY, 'sourceId', stringSocket);

    const onClick = () => {
      node.addOutput(
        new Rete.Output(`${OUTPUT_KEY}${index}`, `${OUTPUT_KEY}${index}`, stringSocket),
      );
      index += 1;
      node.data.outputCount += 1;
      node.update(); // Rerender ConcatComponent
    };

    node
      .addInput(input)
      .addOutput(output)
      .addControl(new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, { label: 'sourceId' }))
      // .addControl(new TextControl(this.editor, CONTROL_KEY, node, true))
      .addControl(
        new ButtonControl(this.editor, 'addOutputSocket', {
          text: 'Add Output Socket',
          onClick,
        }),
      );

    // Initial the source ID input box with value
    if (this.getSourceId(node) === null || this.getSourceId(node) === undefined) {
      this.setSourceId(node, `nmSourceId${Math.round(Math.random() * 1000)}`);
    }

    if (node.data.outputCount > 0) {
      for (let i = 0; i < node.data.outputCount; i += 1) {
        node.addOutput(
          new Rete.Output(`${OUTPUT_KEY}${i}`, `${OUTPUT_KEY}${i}`, stringSocket),
        );
        index += 1;
      }
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
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    const geojson = inputs.json[0];

    if (!geojson) {
      // no data input, maybe link disconnect
      this.updateText(node, '');
      return;
    }

    outputs[OUTPUT_KEY] = this.getSourceId(node);
    for (let i = 0; i < node.data.outputCount; i += 1) {
      outputs[`${OUTPUT_KEY}${i}`] = this.getSourceId(node);
    }

    if (this.mapReady) {
      this.addOrUpdateSource(geojson, node);
    } else {
      window.mapbox.on('load', () => {
        this.addOrUpdateSource(geojson, node);
      });
    }
  }

  // update text in preview control
  updateText(node, text) {
    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls
      .get(CONTROL_KEY)
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
