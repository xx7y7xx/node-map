import Rete, { Node, Component } from 'rete';
// import * as turf from '@turf/turf';

import { objectSocket } from './JsonComponent';
import { stringSocket } from './UploadCsvComponent';
import InputControl from './InputControl';
import SwitchControl from './SwitchControl';
import InputNumberControl from './InputNumberControl';
import { genSourceId } from './helpers';
import {
  GeoJSONSource,
  GeoJSONSourceOptions,
  MapSourceDataEvent,
} from 'mapbox-gl';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { FeatureCollection } from 'geojson';

const KEY = 'GeoJSONSource';
const INPUT_KEY = 'json';
const OUTPUT_KEY = 'sourceId';
export const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';

const defaultCluster = false;
const defaultClusterMaxZoom = 14; // TODO Defaults to one zoom less than maxzoom (so that last zoom features are not clustered).
const defaultClusterRadius = 50;

/**
 * API - https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource
 * Input1: JSON (GeoJSON)
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
export default class GeoJSONSourceComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  static inputKey = INPUT_KEY;

  static outputKey = OUTPUT_KEY;

  nodeIdMap: any;

  async builder(node: Node) {
    console.debug('GeoJSONSourceComponent builder', node);

    if (!this.editor) {
      return;
    }

    if (!this.nodeIdMap) this.nodeIdMap = {};
    this.nodeIdMap[node.id] = node;

    if (node.data.cluster === undefined) {
      node.data.cluster = defaultCluster;
    }
    if (node.data.clusterMaxZoom === undefined) {
      node.data.clusterMaxZoom = defaultClusterMaxZoom;
    }
    if (node.data.clusterRadius === undefined) {
      node.data.clusterRadius = defaultClusterRadius;
    }

    const input = new Rete.Input(INPUT_KEY, 'JSON', objectSocket);
    const output = new Rete.Output(OUTPUT_KEY, 'sourceId', stringSocket);

    node
      .addInput(input)
      .addOutput(output)
      .addControl(
        new InputControl(this.editor, CONTROL_KEY_SOURCE_ID, node, {
          label: 'sourceId',
        }),
      )
      .addControl(
        new SwitchControl(this.editor, 'cluster', node, { label: 'cluster' }),
      )
      .addControl(
        new InputNumberControl(this.editor, 'clusterMaxZoom', node, {
          label: 'clusterMaxZoom',
        }),
      ) // Max zoom to cluster points on
      .addControl(
        new InputNumberControl(this.editor, 'clusterRadius', node, {
          label: 'clusterRadius',
        }),
      ); // Radius of each cluster when clustering points (defaults to 50)

    // Initial the source ID input box with value
    if (
      this.getSourceId(node) === null ||
      this.getSourceId(node) === undefined
    ) {
      this.setSourceId(node, genSourceId());
    }

    window.mapbox.on('sourcedata', (e: MapSourceDataEvent) => {
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

    // return node;
  }

  getSourceId(node: Node | NodeData) {
    return this.nodeIdMap[node.id].data[CONTROL_KEY_SOURCE_ID];
  }

  getNodeDataByKey(node: NodeData, key: string) {
    return this.nodeIdMap[node.id].data[key];
  }

  setSourceId(node: Node, val: string) {
    this.nodeIdMap[node.id].data[CONTROL_KEY_SOURCE_ID] = val;
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.debug('GeoJSONSourceComponent worker', node, inputs, outputs);
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    const geojson = inputs[INPUT_KEY][0] as FeatureCollection;

    if (!geojson) {
      // no data input, maybe link disconnect
      return;
    }

    const sourceId = this.getSourceId(node);
    console.debug('GeoJSONSourceComponent output sourceId', sourceId);
    outputs[OUTPUT_KEY] = sourceId;

    this.addOrUpdateSource(geojson, node);
  }

  addOrUpdateSource(geojson: FeatureCollection, node: NodeData) {
    console.debug('GeoJSONSourceComponent addOrUpdateSource', geojson, node);
    const map = window.mapbox;

    const sourceId = this.getSourceId(node);
    const mpSource = map.getSource(sourceId);
    if (mpSource) {
      console.debug('GeoJSONSourceComponent source exists', sourceId);
      // some layers may use this source now
      // map.removeSource(this.getSourceId(node));
      (map.getSource(this.getSourceId(node)) as GeoJSONSource).setData(geojson);

      // To update a source's cluster prop, below code is not working
      // ```js
      // mpSource.cluster = true;
      // ```
      // after checking below links, try to replace whole style
      // https://github.com/mapbox/mapbox-gl-js/issues/5595
      // https://stackoverflow.com/questions/70109527/mapbox-change-source-property
      // TODO maybe have performance issues when replacing whole style
      const style = map.getStyle();
      (style.sources[sourceId] as GeoJSONSourceOptions).cluster =
        this.getNodeDataByKey(node, 'cluster');
      (style.sources[sourceId] as GeoJSONSourceOptions).clusterMaxZoom =
        this.getNodeDataByKey(node, 'clusterMaxZoom');
      (style.sources[sourceId] as GeoJSONSourceOptions).clusterRadius =
        this.getNodeDataByKey(node, 'clusterRadius');
      map.setStyle(style);
    } else {
      console.debug('GeoJSONSourceComponent source doesnt exist', sourceId);
      window.mapbox.addSource(this.getSourceId(node), {
        type: 'geojson',
        data: geojson,
        cluster: this.getNodeDataByKey(node, 'cluster'),
        clusterMaxZoom: this.getNodeDataByKey(node, 'clusterMaxZoom'), // Max zoom to cluster points on
        clusterRadius: this.getNodeDataByKey(node, 'clusterRadius'), // Radius of each cluster when clustering points (defaults to 50)
      });
    }
  }
}
