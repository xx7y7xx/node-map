import Rete from 'rete';
// import * as turf from '@turf/turf';

import { objectSocket } from './JsonComponent';
import { stringSocket } from './UploadCsvComponent';
import InputControl from './InputControl';
import SwitchControl from './SwitchControl';
import InputNumberControl from './InputNumberControl';
import { genSourceId } from './helpers';

const KEY = 'GeoJSONSource';
export const INPUT_KEY = 'json';
export const OUTPUT_KEY = 'sourceId';
export const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';
export const CONTROL_KEY_CLUSTER = 'controlKeyCluster';
export const CONTROL_KEY_CLUSTER_MAX_ZOOM = 'controlKeyClusterMaxZoom';
export const CONTROL_KEY_CLUSTER_RADIUS = 'controlKeyClusterRadius';

const defaultCluster = false;
const defaultClusterMaxZoom = 14; // TODO Defaults to one zoom less than maxzoom (so that last zoom features are not clustered).
const defaultClusterRadius = 50;

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

    if (node.data[CONTROL_KEY_CLUSTER] === undefined) {
      node.data[CONTROL_KEY_CLUSTER] = defaultCluster;
    }
    if (node.data[CONTROL_KEY_CLUSTER_MAX_ZOOM] === undefined) {
      node.data[CONTROL_KEY_CLUSTER_MAX_ZOOM] = defaultClusterMaxZoom;
    }
    if (node.data[CONTROL_KEY_CLUSTER_RADIUS] === undefined) {
      node.data[CONTROL_KEY_CLUSTER_RADIUS] = defaultClusterRadius;
    }

    const input = new Rete.Input(INPUT_KEY, 'GeoJSON', objectSocket);
    const output = new Rete.Output(OUTPUT_KEY, 'sourceId', stringSocket);

    node
      .addInput(input)
      .addOutput(output)
      .addControl(new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, { label: 'sourceId' }))
      .addControl(new SwitchControl(this.editor, CONTROL_KEY_CLUSTER, node, { label: 'cluster' }))
      .addControl(new InputNumberControl(this.editor, CONTROL_KEY_CLUSTER_MAX_ZOOM, node, { label: 'clusterMaxZoom' })) // Max zoom to cluster points on
      .addControl(new InputNumberControl(this.editor, CONTROL_KEY_CLUSTER_RADIUS, node, { label: 'clusterRadius' })); // Radius of each cluster when clustering points (defaults to 50)

    // Initial the source ID input box with value
    if (this.getSourceId(node) === null || this.getSourceId(node) === undefined) {
      this.setSourceId(node, genSourceId());
    }

    window.mapbox.on('sourcedata', (e) => {
      if (e.sourceId !== this.getSourceId(node) || !e.isSourceLoaded) return;
      const fs = window.mapbox.querySourceFeatures(this.getSourceId(node));
      if (fs.length === 0) return;

      console.debug('zoom to features, fitBounds', fs);

      // has animation
      // const bbox = turf.bbox({
      //   type: 'FeatureCollection',
      //   features: fs,
      // });
      // window.mapbox.fitBounds(bbox, { padding: 20, linear: true });

      // no animation
      // window.mapbox.jumpTo({
      //   center: turf.center({
      //     type: 'FeatureCollection',
      //     features: fs,
      //   }).geometry.coordinates,
      //   zoom: 5,
      // });
    });

    return node;
  }

  getSourceId(node) {
    return this.nodeIdMap[node.id].data[CONTROL_KEY_SOURCE_ID];
  }

  getNodeDataByKey(node, key) {
    return this.nodeIdMap[node.id].data[key];
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

    const sourceId = this.getSourceId(node);
    console.debug('GeoJSONSourceComponent output sourceId', sourceId);
    outputs[OUTPUT_KEY] = sourceId;

    this.addOrUpdateSource(geojson, node);
  }

  addOrUpdateSource(geojson, node) {
    console.debug('GeoJSONSourceComponent addOrUpdateSource', geojson, node);
    const map = window.mapbox;

    const sourceId = this.getSourceId(node);
    const mpSource = map.getSource(sourceId);
    if (mpSource) {
      console.debug('GeoJSONSourceComponent source exists', sourceId);
      // some layers may use this source now
      // map.removeSource(this.getSourceId(node));
      map.getSource(this.getSourceId(node)).setData(geojson);

      // To update a source's cluster prop, below code is not working
      // ```js
      // mpSource.cluster = true;
      // ```
      // after checking below links, try to replace whole style
      // https://github.com/mapbox/mapbox-gl-js/issues/5595
      // https://stackoverflow.com/questions/70109527/mapbox-change-source-property
      // TODO maybe have performance issues when replacing whole style
      const style = map.getStyle();
      style.sources[sourceId].cluster = this.getNodeDataByKey(node, CONTROL_KEY_CLUSTER);
      style.sources[sourceId].clusterMaxZoom = this.getNodeDataByKey(node, CONTROL_KEY_CLUSTER_MAX_ZOOM);
      style.sources[sourceId].clusterRadius = this.getNodeDataByKey(node, CONTROL_KEY_CLUSTER_RADIUS);
      map.setStyle(style);
    } else {
      console.debug('GeoJSONSourceComponent source doesnt exist', sourceId);
      window.mapbox.addSource(this.getSourceId(node), {
        type: 'geojson',
        data: geojson,
        cluster: this.getNodeDataByKey(node, CONTROL_KEY_CLUSTER),
        clusterMaxZoom: this.getNodeDataByKey(node, CONTROL_KEY_CLUSTER_MAX_ZOOM), // Max zoom to cluster points on
        clusterRadius: this.getNodeDataByKey(node, CONTROL_KEY_CLUSTER_RADIUS), // Radius of each cluster when clustering points (defaults to 50)
      });
    }
  }
}
