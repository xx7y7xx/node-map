import Rete from 'rete';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

const ARROW_URL = '/node-map/img/arrow.png';

/**
 * MapControl hold mapbox's layer and data source
 */
export default class MapControl extends Rete.Control {
  static component = () => null;

  constructor(emitter, key, props) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = MapControl.component;

    this.sourceId = props.sourceId;
    this.layerId = props.layerId;
    this.layerIdPoint = props.layerIdPoint;

    this.mmaapp();
  }

  mmaapp() {
    window.mapbox.on('sourcedata', (e) => {
      if (e.sourceId !== this.sourceId || !e.isSourceLoaded) return;
      const fs = window.mapbox.querySourceFeatures(this.sourceId);
      if (fs.length === 0) return;
      // console.debug('zoom to features', fs);
      const bbox = turf.bbox({
        type: 'FeatureCollection',
        features: fs,
      });
      window.mapbox.fitBounds(bbox, { padding: 20 });
    });
  }

  addOrUpdateSource(geojson) {
    if (window.mapboxReady) {
      this.addOrUpdateSource2(geojson);
    } else {
      window.mapbox.on('load', () => {
        this.addOrUpdateSource2(geojson);
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addOrUpdateSource2(geojson) {
    const map = window.mapbox;

    const sourceData = {
      type: 'geojson',
      data: geojson,
    };

    // this.updateText(node, `${JSON.stringify(sourceData)}`);

    const { sourceId } = this;
    const mpSource = map.getSource(sourceId);
    if (mpSource) {
      // some layers may use this source now
      // map.removeSource(sourceId);
      map.getSource(sourceId).setData(sourceData.data);
    } else {
      console.debug('addSource', sourceId);
      window.mapbox.addSource(sourceId, sourceData);
    }
  }

  addOrUpdateLayer(lineCfg) {
    if (window.mapboxReady) {
      this.addOrUpdateLayer2(lineCfg);
    } else {
      window.mapbox.on('load', () => {
        this.addOrUpdateLayer2(lineCfg);
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addOrUpdateLayer2({ lineColor, lineWidth }) {
    const map = window.mapbox;

    if (map.getLayer(this.layerId)) {
      map.setPaintProperty(this.layerId, 'line-color', lineColor);
      map.setPaintProperty(this.layerId, 'line-width', lineWidth);
      map.setPaintProperty(this.layerIdPoint, 'circle-color', lineColor);
      map.setPaintProperty(this.layerIdPoint, 'circle-radius', lineWidth);
    } else {
      console.debug('addLayer', this.layerId);
      window.mapbox.addLayer({
        // id: LAYER_ID,
        id: this.layerId,
        type: 'line',
        source: this.sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': lineColor,
          'line-width': lineWidth,
        },
      });

      console.debug('addLayer', this.layerIdPoint);
      window.mapbox.addLayer({
        // id: LAYER_ID_POINT,
        id: this.layerIdPoint,
        type: 'circle',
        source: this.sourceId,
        paint: {
          'circle-radius': lineWidth,
          'circle-color': lineColor,
        },
      });

      map.loadImage(ARROW_URL, (err, image) => {
        if (err) {
          console.error('err image', err);
          return;
        }
        map.addImage('arrow', image);
        map.addLayer({
          id: 'arrow-layer',
          type: 'symbol',
          source: this.sourceId,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 1,
            'icon-allow-overlap': true,
            // 'icon-ignore-placement': true,
            'icon-image': 'arrow',
            'icon-size': 0.045,
            visibility: 'visible',
          },
        });
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on('mouseenter', this.layerIdPoint, (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        if (e.features[0].geometry.type !== 'Point') {
          // Only show popup for Point
          return;
        }

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { description } = e.features[0].properties;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on('mouseleave', this.layerIdPoint, () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    }
  }

  removeLayers() {
    // no data input, maybe link disconnect
    const map = window.mapbox;

    if (map.getLayer(this.layerId)) {
      console.debug('removeLayer', this.layerId);
      map.removeLayer(this.layerId);
    }
    if (map.getLayer(this.layerIdPoint)) {
      console.debug('removeLayer', this.layerIdPoint);
      map.removeLayer(this.layerIdPoint);
    }
  }

  // // update text in preview control
  // updateText(node, text) {
  //   this.editor.nodes
  //     .find((n) => n.id === node.id)
  //     .controls
  //     .get(CONTROL_KEY_GEOJSON)
  //     ?.setValue(text);
  // }
}
