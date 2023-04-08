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
};
type Properties = {
  [key: string]: Item;
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

    // add layer controls
    Object.keys(allProperties).forEach((key) => {
      const { control: Ctrl, defaultValue, props = {} } = allProperties[key];

      if (!node.data[key] === undefined) {
        node.data[key] = defaultValue;
      }

      node.addControl(
        new Ctrl(this.editor, key, node, { label: key, ...props }),
      );
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

    this.addOrUpdateLayer(sourceId, node);
  }

  addOrUpdateLayer(sourceId: string, node: NodeData) {
    const map = window.mapbox;
    // const { layerId } = node.data;
    const layerId = node.data.layerId as string;

    if (map.getLayer(layerId)) {
      console.debug('LayerComponent layer exists', layerId);
      map.setFilter(layerId, node.data.filter as string[]);

      Object.keys(this.layoutProperties).forEach((key) => {
        if (key === 'text-field') {
          map.setLayoutProperty(
            layerId,
            key,
            this.convertTextField(node.data[key] as string),
          ); // TODO
        } else {
          map.setLayoutProperty(layerId, key, node.data[key]);
        }
      });
      Object.keys(this.paintProperties).forEach((key) => {
        map.setPaintProperty(layerId, key, node.data[key]);
      });
    } else {
      console.debug('LayerComponent layer doesnt exist', layerId);
      const config: Layer = {
        id: layerId,
        type: this.type, // 'line',
        source: sourceId,
        // layout: {
        //   'line-join': 'round',
        //   'line-cap': 'round',
        // },
        layout: {
          ...Object.keys(this.layoutProperties).reduce(
            (a, v) => ({
              ...a,
              [v]:
                v === 'text-field'
                  ? this.convertTextField(node.data[v] as string)
                  : node.data[v],
            }),
            {},
          ),
        },
        paint: {
          ...Object.keys(this.paintProperties).reduce(
            (a, v) => ({ ...a, [v]: node.data[v] }),
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

  convertTextField(textField: string) {
    const inputBoxStr = textField || '';
    if (!inputBoxStr.startsWith('[')) {
      return textField;
    }
    return JSON.parse(inputBoxStr);
  }
}
