import Rete, { Component, Node } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import InputControl from './InputControl';
import { stringSocket } from './UploadCsvComponent';

export const KEY = 'Image';
export const OUTPUT_KEY = 'imageId';
export const CONTROL_KEY = 'imageUrl';
export const CONTROL_KEY_IMG_ID = 'imageId';

export default class ImageComponent extends Component {
  constructor() {
    super(KEY); // node title
  }

  static key = KEY;

  async builder(node: Node) {
    if (!this.editor) {
      return;
    }
    node
      .addControl(new InputControl(this.editor, CONTROL_KEY, node))
      .addControl(new InputControl(this.editor, CONTROL_KEY_IMG_ID, node))
      .addOutput(new Rete.Output(OUTPUT_KEY, OUTPUT_KEY, stringSocket));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    // `node.data` is `{}` (empty object) when node just created on board
    if (!node.data[CONTROL_KEY] || !node.data[CONTROL_KEY_IMG_ID]) return;

    const map = window.mapbox;
    const imgId = node.data[CONTROL_KEY_IMG_ID] as string;
    const url = node.data[CONTROL_KEY] as string;

    // Load an image from an external URL.
    map.loadImage(url, (error: any, image: any) => {
      if (error) {
        console.error('[ImageComponent] Failed to map.loadImage', error, url);
        throw error;
      }

      if (!map.hasImage(imgId)) {
        // Add the image to the map style.
        map.addImage(imgId, image);
      }

      outputs[OUTPUT_KEY] = imgId;
    });
  }
}
