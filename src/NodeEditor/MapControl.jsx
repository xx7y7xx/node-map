import React from 'react';

import Rete from 'rete';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import MapLayerConfigDrawer from './components/MapLayerConfigDrawer';

const ARROW_URL = '/node-map/img/arrow.png';

const fillColor = (colorBaseOnField = '') => (
  [
    'step',
    ['get', colorBaseOnField],
    '#EFFF85',
    1, '#98F300',
    2, '#37C508',
    3, '#00CA8D',
    4, '#0098A3',
  ]
);

const isEmpty = (geojson) => {
  if (geojson.type === 'FeatureCollection') {
    return geojson.features.length === 0;
  }
  // if (geojson.type === 'Feature') { }
  return false;
};

/**
 * MapControl hold mapbox's layer and data source
 */
export default class MapControl extends Rete.Control {
  // @type {Node|null} In constructor this.parent is null
  // parent

  static component = MapLayerConfigDrawer;

  /**
   *
   * @param {*} emitter
   * @param {*} key Control key, one component may have two controls, each control has its own control key
   * @param {Object} props
   * @param {string} props.sourceId
   */
  constructor(emitter, key, props) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = MapControl.component;

    this.sourceId = props.sourceId; // "nmSourceId123"
    this.layerId = `${this.sourceId}LayerId`;
    this.layerIdPoint = `${this.sourceId}LayerIdPoint`;
    this.layerIdFill = `${this.sourceId}LayerIdFill`;
    this.layerIdArrow = `${this.sourceId}LayerIdArrow`;
    this.imageIdArrow = `${this.sourceId}ImageIdArrow`;
    this.hoveredStateId = null; // The id when mouse hover on
    // layer id list
    this.layerIdList = [this.layerId, this.layerIdPoint, this.layerIdFill, this.layerIdArrow];

    /**
     * IMPORTANT!
     * NOT call getNode or putData, because these function will check control.parent first
     * but when executing in this control constructor, the control.parent is null (not ready)
     */
    // console.log('this.parent node', this.getNode());
    // // if no data loaded from cache, then init with new data
    // if (!this.parent.data[key]) {
    //   // the save data of this control is like {lineColor:"#ccc",lineWidth:1}
    //   this.putData(this.key, {});
    // }

    const defaultValue = props.defaultValue || {
      lineColor: '#000',
    };

    // pass props to component
    this.props = {
      defaultValue,
      onChange: this.handleChange.bind(this),
    };

    // this.mmaapp();
    this.initMap(defaultValue);
  }

  handleChange(field, val) {
    this.putData(this.key, {
      ...(this.getData(this.key) || {}),
      [field]: val,
    });
    this.emitter.trigger('process'); // trigger process to save new val to local cache

    if (field === 'lineColor') {
      const map = window.mapbox;
      map.setPaintProperty(this.layerId, 'line-color', val);
      map.setPaintProperty(this.layerIdPoint, 'circle-color', val);
    }
  }

  initMap(defaultValue) {
    const map = window.mapbox;

    const loadSourceAndLayers = () => {
      console.debug('addSource', this.sourceId);
      map.addSource(this.sourceId, {
        type: 'geojson',
        data: turf.featureCollection([]),
        // A property to use as a feature id (for feature state)
        // TODO Maybe could let user change this field name from 'id' to other
        promoteId: 'id',
      });

      console.debug('addLayer', this.layerId);
      window.mapbox.addLayer({
        id: this.layerId,
        type: 'line',
        source: this.sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': defaultValue.lineColor,
          // 'line-width': lineWidth,
        },
      });

      console.debug('addLayer', this.layerIdPoint);
      window.mapbox.addLayer({
        id: this.layerIdPoint,
        type: 'circle',
        source: this.sourceId,
        paint: {
          // 'circle-radius': lineWidth,
          'circle-color': defaultValue.lineColor,
        },
      });

      console.debug('addLayer', this.layerIdFill);
      window.mapbox.addLayer({
        id: this.layerIdFill,
        type: 'fill',
        source: this.sourceId,
        paint: {
          // 'fill-opacity': 0.5,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.5,
          ],
          // 'fill-color': lineColor,
          // 'fill-color': ['interpolate', ['linear'], ['get', 'value'], 0, 'red', 10, 'yellow'],
          // 'fill-color': [
          //   'interpolate', ['linear'], ['get', 'value'],
          //   // value ≤ 0 时，半径为 5
          //   0, 'red',
          //   // value ≥ 100 时，半径为 15
          //   3, 'green',
          // ],
          // 'fill-color': [
          //   'step',
          //   ['get', ''],
          //   '#EFFF85',
          //   1, '#98F300',
          //   2, '#37C508',
          //   3, '#00CA8D',
          //   4, '#0098A3',
          // ],
          'fill-color': fillColor(),
        },
      });
    };

    if (!window.mapboxReady) {
      map.on('load', loadSourceAndLayers);
    } else {
      loadSourceAndLayers();
    }
  }

  /**
   * When new data loaded, fly to the data.
   * Not work since querySourceFeatures() only returns features in the viewport
   */
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

  setSourceAndLayer(geojson, lineCfg) {
    if (window.mapboxReady) {
      this._addOrUpdateAll(geojson, lineCfg);
    } else {
      window.mapbox.on('load', () => {
        this._addOrUpdateAll(geojson, lineCfg);
      });
    }
  }

  removeData() {
    this._addOrUpdateSource(turf.featureCollection([]));
  }

  _addOrUpdateAll(geojson, lineCfg) {
    this._addOrUpdateSource(geojson);
    this._addOrUpdateLayer(lineCfg);
    this._addOrUpdateImage(geojson);
  }

  // Another simple solution is just using icon from mapbox
  // https://stackoverflow.com/questions/61918545/how-can-i-create-a-style-with-directional-lines-in-mapbox-studio
  _addOrUpdateImage(geojson) {
    const map = window.mapbox;

    // * When first feature in collection is not line string, then no show arrow image
    // * When the feature is not line string, then no show arrow image
    if (geojson.type === 'FeatureCollection') {
      if (geojson.features[0].geometry.type !== 'LineString') {
        return;
      }
    } else if (geojson.type === 'Feature') {
      if (geojson.geometry.type !== 'LineString') {
        return;
      }
    }

    // console.log('image exists?', map.hasImage(this.imageIdArrow));
    if (map.getLayer(this.layerIdArrow)) {
      return;
    }
    map.loadImage(ARROW_URL, (err, image) => {
      if (err) {
        console.error('Failed to map.loadImage()', err);
        return;
      }
      map.addImage(this.imageIdArrow, image);
      map.addLayer({
        id: this.layerIdArrow,
        type: 'symbol',
        source: this.sourceId,
        layout: {
          'symbol-placement': 'line',
          'symbol-spacing': 100,
          'icon-allow-overlap': true,
          // 'icon-ignore-placement': true,
          'icon-image': this.imageIdArrow,
          'icon-size': 1,
          visibility: 'visible',
        },
      });
    });
  }

  _addOrUpdateSource(geojson) {
    const map = window.mapbox;

    // Fly map to data
    if (!isEmpty(geojson)) {
      window.mapbox.fitBounds(turf.bbox(
        geojson,
      ), { padding: 200 });
    }

    // this.updateText(node, `${JSON.stringify(sourceData)}`);

    const { sourceId } = this;
    const mpSource = map.getSource(sourceId);
    if (!mpSource) {
      console.warn('MapControl cannot find map source');
    } else {
      // some layers may use this source now
      // map.removeSource(sourceId);
      map.getSource(sourceId).setData(geojson);
    }
  }

  _addOrUpdateLayer({ lineColor, lineWidth, colorBaseOnField }) {
    const map = window.mapbox;

    if (map.getLayer(this.layerId)) {
      // map.setPaintProperty(this.layerId, 'line-color', lineColor);
      map.setPaintProperty(this.layerId, 'line-width', lineWidth);
      // map.setPaintProperty(this.layerIdPoint, 'circle-color', lineColor);
      map.setPaintProperty(this.layerIdPoint, 'circle-radius', lineWidth);
      map.setPaintProperty(this.layerIdFill, 'fill-color', fillColor(colorBaseOnField));
    } else {
      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      this.mouseEventHover(this.layerIdFill);

      // Show popup when mouse on a circle
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

    this.layerIdList.forEach((lId) => {
      if (map.getLayer(lId)) {
        console.debug('removeLayer', lId);
        map.removeLayer(lId);
      }
    });
  }

  // // update text in preview control
  // updateText(node, text) {
  //   this.editor.nodes
  //     .find((n) => n.id === node.id)
  //     .controls
  //     .get(CONTROL_KEY_GEOJSON)
  //     ?.setValue(text);
  // }

  mouseEventHover(layerId) {
    const map = window.mapbox;
    // When the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    map.on('mousemove', layerId, (e) => {
      if (!(e.features.length > 0)) {
        return;
      }
      // `features[0].id` is defined in `promoteId` when `addSource`
      // TODO maybe could be customized by users in the future
      const featureId = e.features[0].id;
      if (featureId === undefined) {
        console.warn('Cannot find feature[0].properties.id in source data. Will not show hover effect.', e.features);
        return;
      }
      if (this.hoveredStateId !== null) {
        map.setFeatureState(
          { source: this.sourceId, id: this.hoveredStateId },
          { hover: false },
        );
      }
      this.hoveredStateId = featureId;
      map.setFeatureState(
        { source: this.sourceId, id: this.hoveredStateId },
        { hover: true },
      );
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', layerId, () => {
      if (this.hoveredStateId !== null) {
        map.setFeatureState(
          { source: this.sourceId, id: this.hoveredStateId },
          { hover: false },
        );
      }
      this.hoveredStateId = null;
    });
  }
}
