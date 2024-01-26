import Rete, { Node, Component } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import {
  GeoJSONSource,
  GeoJSONSourceOptions,
  MapSourceDataEvent,
} from 'mapbox-gl';
import { FeatureCollection } from 'geojson';
// import * as turf from '@turf/turf';

import { stringSocket } from './UploadCsvComponent';
import InputControl from './InputControl';
import SwitchControl from './SwitchControl';
import InputNumberControl from './InputNumberControl';
import JsonEditorControl from './JsonEditorControl';
import { genSourceId } from './helpers';
import { getPropertyValue, inputControlFactory } from './nodeHelpers';

const KEY = 'GeoJSONSource';
const OUTPUT_KEY = 'sourceId';
export const CONTROL_KEY_SOURCE_ID = 'controlKeySourceId';

const defaultCluster = false;
const defaultClusterMaxZoom = 14; // TODO Defaults to one zoom less than maxzoom (so that last zoom features are not clustered).
const defaultClusterRadius = 50;

// How to name the label
// 1. map.addSource(id, source) API - https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addsource
// 2. source definition - https://docs.mapbox.com/style-spec/reference/sources/#geojson
const geojsonSourceProps = [
  {
    key: CONTROL_KEY_SOURCE_ID,
    label: 'id', // which is the good name? 'id' or 'sourceId'?
    control: InputControl,
    props: {
      tooltip:
        'The ID of the source to add. Must not conflict with existing sources. Type is string',
    },
  },
  {
    key: 'source.cluster',
    label: 'source.cluster',
    control: SwitchControl,
    defaultValue: defaultCluster,
    props: {
      tooltip:
        'If the data is a collection of point features, setting this to true clusters the points by radius into groups.',
    },
  },
  {
    key: 'source.clusterMaxZoom',
    label: 'source.clusterMaxZoom',
    defaultValue: defaultClusterMaxZoom,
    control: InputNumberControl,
    props: {
      tooltip: 'Max zoom to cluster points on',
    },
  },
  {
    key: 'source.clusterRadius',
    label: 'source.clusterRadius',
    control: InputNumberControl,
    defaultValue: defaultClusterRadius,
    props: {
      tooltip: 'Radius of each cluster when clustering points (defaults to 50)',
    },
  },
  {
    key: 'source.data',
    label: 'source.data',
    control: JsonEditorControl,
    props: {
      tooltip: 'A URL to a GeoJSON file, or inline GeoJSON.',
    },
  },
];

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
 *
 * The code behind this node
 * ```js
 * if (map.getSource(id)) {
 *   map.getSource(id).setData(geojson)
 * } else {
 *   map.addSource(id, source)
 * }
 * ```
 */
export default class GeoJSONSourceComponent extends Component {
  constructor() {
    super(KEY);
  }

  static key = KEY;

  static outputKey = OUTPUT_KEY;

  nodeIdMap: any;

  async builder(node: Node) {
    console.debug('GeoJSONSourceComponent builder', node);

    if (!this.editor) {
      return;
    }

    if (!this.nodeIdMap) this.nodeIdMap = {};
    this.nodeIdMap[node.id] = node;

    geojsonSourceProps.forEach(inputControlFactory(this.editor, node));

    const output = new Rete.Output(OUTPUT_KEY, 'sourceId', stringSocket);
    node.addOutput(output);

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

  // getNodeDataByKey(node: NodeData, key: string) {
  //   return this.nodeIdMap[node.id].data[key];
  // }

  setSourceId(node: Node, val: string) {
    this.nodeIdMap[node.id].data[CONTROL_KEY_SOURCE_ID] = val;
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.debug('GeoJSONSourceComponent worker', node, inputs, outputs);

    let geojson: FeatureCollection;
    if (inputs['source.data'] && inputs['source.data'][0]) {
      geojson = inputs['source.data'][0] as FeatureCollection;
    } else {
      geojson = (node.data['source.data'] as any).obj as FeatureCollection;
    }

    if (!geojson) {
      // no data input, maybe link disconnect
      return;
    }

    const sourceId = this.getSourceId(node);
    console.debug('GeoJSONSourceComponent output sourceId', sourceId);
    outputs[OUTPUT_KEY] = sourceId;

    this.addOrUpdateSource(geojson, node, inputs);
  }

  addOrUpdateSource(
    geojson: FeatureCollection,
    node: NodeData,
    inputs: WorkerInputs,
  ) {
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
        getPropertyValue('source.cluster', node, inputs);
      (style.sources[sourceId] as GeoJSONSourceOptions).clusterMaxZoom =
        getPropertyValue('source.clusterMaxZoom', node, inputs);
      (style.sources[sourceId] as GeoJSONSourceOptions).clusterRadius =
        getPropertyValue('source.clusterRadius', node, inputs);
      map.setStyle(style);
    } else {
      console.debug('GeoJSONSourceComponent source doesnt exist', sourceId);
      window.mapbox.addSource(this.getSourceId(node), {
        type: 'geojson',
        data: geojson,
        cluster: getPropertyValue('source.cluster', node, inputs),
        clusterMaxZoom: getPropertyValue('source.clusterMaxZoom', node, inputs), // Max zoom to cluster points on
        clusterRadius: getPropertyValue('source.clusterRadius', node, inputs), // Radius of each cluster when clustering points (defaults to 50)
      });
    }
  }
}
