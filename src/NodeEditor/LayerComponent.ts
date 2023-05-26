import Rete, { Component, Node } from 'rete';

import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'; // eslint-disable-line import/no-unresolved
import { AnyLayer, Layer, Map } from 'mapbox-gl';
import InputControl from './InputControl';
import ExpressionControl from './ExpressionControl';
import { stringSocket } from './UploadCsvComponent';
import { genLayer } from './helpers';

const INPUT_KEY = 'sourceId';

declare global {
  interface Window {
    mapbox: Map;
  }
}

type Item = {
  control: any;
  defaultValue: any;
  props?: {
    [key: string]: unknown;
  };
  /**
   * whether given this control an input connection
   * For the inputs of one node, they can be a static input, this type of input needs an input connection from other node's output.
   * They can also be a control like an input box, then no need to link to other nodes.
   */
  input?: boolean;
};
type Properties = {
  [key: string]: Item;
};

const convertTextField = (textField: string) => {
  const inputBoxStr = textField || '';
  if (!inputBoxStr.startsWith('[')) {
    return textField;
  }
  return JSON.parse(inputBoxStr);
};

// get the property value from node's saved data or data from input connections
const getPropertyValue = (
  key: string,
  node: NodeData,
  inputs: WorkerInputs,
) => {
  // TODO
  if (key === 'text-field') {
    return convertTextField(node.data[key] as string);
  }

  if (inputs[key] && inputs[key][0]) {
    return inputs[key][0];
  }

  return node.data[key];
};

export default abstract class LayerComponent extends Component {
  static inputKey = INPUT_KEY;

  abstract type: string;

  abstract layoutProperties: Properties;

  abstract paintProperties: Properties;

  abstract layerBuilder(node: Node): Promise<null>;

  async builder(node: Node) {
    // Initial the layer ID input box with value
    if (!node.data.layerId) {
      node.data.layerId = genLayer();
    }

    await this.layerBuilder(node);

    // add layer default input(sourceId) and default controls(layerId+filter)
    node
      .addInput(new Rete.Input(INPUT_KEY, 'sourceId', stringSocket))
      .addControl(
        new InputControl(this.editor, 'layerId', node, {
          label: 'layerId',
          disabled: true,
        }),
      )
      .addControl(
        new ExpressionControl(this.editor, 'filter', node, { label: 'filter' }),
      );

    const allProperties: Properties = {
      ...this.layoutProperties,
      ...this.paintProperties,
    };

    // add layer controls for both paint and layout properties
    Object.keys(allProperties).forEach((key) => {
      const { control: Ctrl, defaultValue, props = {} } = allProperties[key];

      if (node.data[key] === undefined) {
        node.data[key] = defaultValue;
      }

      const _control = new Ctrl(this.editor, key, node, {
        label: key,
        ...props,
      });

      if (allProperties[key].input) {
        const input = new Rete.Input(key, key, stringSocket);
        input.addControl(_control);
        node.addInput(input);
      } else {
        node.addControl(_control);
      }
    });
  }

  abstract layerWorker(
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs,
    ...args: unknown[]
  ): void;

  worker(
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs,
    ...args: unknown[]
  ) {
    console.debug('LayerComponent worker', node, inputs);

    const sourceId = inputs[INPUT_KEY][0] as string;
    const layerId = node.data.layerId as string;

    this.layerWorker(node, inputs, outputs, ...args);

    // if node link disconnect, then clear the layer on map
    if (!sourceId) {
      console.debug('LayerComponent sourceId doesnt exist', sourceId);
      // no data input, maybe link disconnect
      const map = window.mapbox;

      if (map.getLayer(layerId)) {
        console.debug('LayerComponent remove layer', layerId);
        map.removeLayer(layerId);
      }
      return;
    }
    console.debug('LayerComponent sourceId exists', sourceId);

    this.addOrUpdateLayer(sourceId, node, inputs);
  }

  // if layer created already, only update this layer
  addOrUpdateLayer(sourceId: string, node: NodeData, inputs: WorkerInputs) {
    const map = window.mapbox;
    // const { layerId } = node.data;
    const layerId = node.data.layerId as string;

    if (map.getLayer(layerId)) {
      console.debug('LayerComponent layer exists', layerId);

      // set filter
      map.setFilter(layerId, node.data.filter as string[]);

      // set layer properties
      Object.keys(this.layoutProperties).forEach((key) => {
        map.setLayoutProperty(
          layerId,
          key,
          getPropertyValue(key, node, inputs),
        );
      });

      // set paint properties
      Object.keys(this.paintProperties).forEach((key) => {
        map.setPaintProperty(layerId, key, getPropertyValue(key, node, inputs));
      });
    } else {
      console.debug('LayerComponent layer doesnt exist', layerId);
      const config: Layer = {
        id: layerId,
        type: this.type, // 'line',
        source: sourceId,
        layout: {
          // 'line-join': 'round',
          // 'line-cap': 'round',
          ...Object.keys(this.layoutProperties).reduce(
            (a, v) => ({
              ...a,
              [v]: getPropertyValue(v, node, inputs),
            }),
            {},
          ),
        },
        paint: {
          ...Object.keys(this.paintProperties).reduce(
            (a, v) => ({ ...a, [v]: getPropertyValue(v, node, inputs) }),
            {},
          ),
        },
      };
      if (node.data.filter) {
        config.filter = node.data.filter as any[];
      }
      console.debug('LayerComponent add layer', config);
      window.mapbox.addLayer(config as AnyLayer);
    }
  }
}
