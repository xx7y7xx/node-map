import Rete, { Component, Node } from 'rete';
import { LngLatLike } from 'mapbox-gl';

import SliderControl from './SliderControl';
import SelectControl from './SelectControl';
import InputControl from './InputControl';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { MapMouseEvent } from 'mapbox-gl';
import { objectSocket } from './JsonComponent';
import { getPropertyValue } from './nodeHelpers';

const KEY = 'Map';
export const CONTROL_KEY_STYLE = 'inputControlStyle';
export const CONTROL_KEY_LNGLAT = 'inputControlLngLat';
export const CONTROL_KEY_ZOOM = 'inputControlZoom';
export const CONTROL_KEY_PROJECTION = 'inputControlProjection';
const defaultStyle = 'mapbox://styles/mapbox/streets-v12';
const defaultZoom = 9;

// https://docs.mapbox.com/mapbox-gl-js/style-spec/projection/
const PROJECTIONS = [
  'albers',
  'equalEarth',
  'equirectangular',
  'lambertConformalConic',
  'mercator',
  'naturalEarth',
  'winkelTripel',
  'globe',
];

const updateValues = (node: Node) => (event: MapMouseEvent) => {
  const map = event.target;
  (node.controls.get(CONTROL_KEY_LNGLAT) as InputControl)?.setValue(
    `${map?.getCenter().lng},${map?.getCenter().lat}`,
  );
  (node.controls.get(CONTROL_KEY_ZOOM) as SliderControl)?.setValue(
    map?.getZoom(),
  );
};

const projections = PROJECTIONS.map((item) => ({
  value: item,
  label: item,
}));

const mapProps = [
  {
    key: CONTROL_KEY_STYLE,
    label: 'style',
    control: InputControl,
  },
  {
    key: CONTROL_KEY_LNGLAT,
    label: 'lngLat',
    control: InputControl,
    props: {
      tooltip: 'The center of map, type is array, e.g. [103,1]',
    },
  },
  {
    key: CONTROL_KEY_ZOOM,
    label: 'zoom',
    control: SliderControl,
  },
  {
    key: CONTROL_KEY_PROJECTION,
    label: 'projection',
    control: SelectControl,
    props: {
      style: { width: '150px' },
      options: projections,
    },
  },
];

/**
 * Control the center and other props of map
 */
export default class MapComponent extends Component {
  constructor() {
    super(KEY); // node title
  }

  static key = KEY;

  // editor: NodeEditor | null = null;

  async builder(node: Node) {
    console.debug('MapComponent builder', node);

    // init node data
    if (node.data[CONTROL_KEY_STYLE] === undefined) {
      node.data[CONTROL_KEY_STYLE] = defaultStyle;
    }
    if (node.data[CONTROL_KEY_LNGLAT] === undefined) {
      node.data[CONTROL_KEY_LNGLAT] = [0, 0];
    }
    if (node.data[CONTROL_KEY_ZOOM] === undefined) {
      node.data[CONTROL_KEY_ZOOM] = defaultZoom;
    }

    window.mapbox.on('dragend', updateValues(node));
    window.mapbox.on('zoomend', updateValues(node));

    // window.mapbox.jumpTo({
    //   center: node.data[CONTROL_KEY_LNGLAT] as LngLatLike,
    //   zoom: 10,
    // });
    window.mapbox.setCenter(node.data[CONTROL_KEY_LNGLAT] as LngLatLike);
    window.mapbox.setZoom(node.data[CONTROL_KEY_ZOOM] as number);
    window.mapbox.setProjection(node.data[CONTROL_KEY_PROJECTION] as string);

    mapProps.forEach(({ key, label, control: Ctrl, props = {} }) => {
      const _ctrl = new Ctrl(this.editor!, key, node, {
        label: label,
        ...props,
      });
      const _input = new Rete.Input(key, label, objectSocket);
      _input.addControl(_ctrl);
      node.addInput(_input);
    });
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.debug('MapComponent worker', node, inputs, outputs);
    // outputs[OUTPUT_KEY] = node.data[CONTROL_KEY];

    // if (window.mapbox) {
    //   console.debug('[MapComponent] fly to position');
    //   window.mapbox.flyTo({
    //     center: node.data[CONTROL_KEY_LNGLAT],
    //     zoom: node.data[CONTROL_KEY_ZOOM] || defaultZoom,
    //   });
    // }

    // TODO setStyle will also remove all sources/layers
    // window.mapbox.setStyle(node.data[CONTROL_KEY_STYLE]);
    window.mapbox.setZoom(node.data[CONTROL_KEY_ZOOM] as number);
    window.mapbox.setProjection(node.data[CONTROL_KEY_PROJECTION] as string);
    window.mapbox.setCenter(getPropertyValue(CONTROL_KEY_LNGLAT, node, inputs));
  }
}
