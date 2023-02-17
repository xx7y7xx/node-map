import Rete from 'rete';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

import TextControl from './TextControl';
import FaqControl from './FaqControl';
import { objectSocket } from './JsonComponent';
import faq from './PreviewFaq.md';

const SOURCE_ID = 'nm-line-string-source';
const LAYER_ID = 'nm-line-string-layer';
export default class PreviewComponent extends Rete.Component {
  constructor() {
    super('Preview');
    this.markers = [];

    const map = window.mapbox;

    window.mapbox.on('load', () => {
      this.mapReady = true;
    });

    window.mapbox.on('sourcedata', (e) => {
      if (e.sourceId !== SOURCE_ID || !e.isSourceLoaded) return;
      const f = map.querySourceFeatures(SOURCE_ID);
      if (f.length === 0) return;
      const bbox = turf.bbox({
        type: 'FeatureCollection',
        features: f,
      });
      map.fitBounds(bbox, { padding: 20 });
    });
  }

  builder(node) {
    const input = new Rete.Input('json', 'JSON', objectSocket);

    return node
      .addInput(input)
      .addControl(new FaqControl(this.editor, 'faq', node, {
        content: faq,
      }))
      .addControl(new TextControl(this.editor, 'preview', node, true));
  }

  // eslint-disable-next-line no-unused-vars
  worker(node, inputs) {
    console.debug('PreviewComponent.worker:', inputs);
    // inputs.json=[] // no data
    // inputs.json=[[[103.8254528,1.2655414]]]
    // jsonNodeValue=[[103.8254528,1.2655414]]
    const jsonNodeValue = inputs.json[0];

    if (!jsonNodeValue) {
      // no data input, maybe link disconnect
      this.updatePreviewControlText(node, '');
      this.clearMarkers();
      return;
    }

    this.clearMarkers();

    // filter out invalid latlng, then add markers to map
    jsonNodeValue
      // .filter((lngLat) => lngLat[0] && lngLat[1])
      .forEach((feature) => {
        if (typeof feature[0] === 'number') {
          const marker = new mapboxgl.Marker()
            .setLngLat(feature)
            .addTo(window.mapbox);
          this.markers.push(marker);
        } else if (this.mapReady) {
          this.renderLineString(feature);
        } else {
          window.mapbox.on('load', () => {
            this.renderLineString(feature);
          });
        }
      });
    console.debug('[PreviewComponent] fit bounds to markers');
    window.mapbox.fitBounds(turf.bbox(turf.featureCollection(
      jsonNodeValue.filter((f) => typeof f[0] === 'number').map((f) => turf.point(f)),
    )), { padding: 20 });

    this.updatePreviewControlText(node, `${JSON.stringify(jsonNodeValue)}`);
  }

  // update text in preview control
  updatePreviewControlText(node, text) {
    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls
      .get('preview')
      .setValue(text);
  }

  clearMarkers() {
    // clear markers on map
    this.markers.forEach((m) => {
      m.remove();
    });
    this.markers = [];
  }

  renderLineString(feature) {
    const map = window.mapbox;

    if (map.getLayer(LAYER_ID)) {
      map.removeLayer(LAYER_ID);
    }

    const mpSource = map.getSource(SOURCE_ID);
    if (mpSource) {
      map.removeSource(SOURCE_ID);
    }

    window.mapbox.addSource(SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: feature,
        },
      },
    });
    window.mapbox.addLayer({
      id: LAYER_ID,
      type: 'line',
      source: SOURCE_ID,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#888',
        'line-width': 8,
      },
    });
  }
}
