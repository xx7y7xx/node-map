import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { imageIdArrow, ARROW_URL } from 'constants';

mapboxgl.accessToken = 'pk.eyJ1Ijoibm90YWxlbWVzYSIsImEiOiJjazhiOTZnb2gwM3NxM2ZucGp1Z21mNjZ0In0.Z4nS6wdB4WzflkDItyXSIQ';

export default function Map({ width, onMapboxReady }) {
  const mapboxElRef = useRef(null); // DOM element to render map

  useEffect(() => {
    const options = {
      container: mapboxElRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      // style: 'mapbox://styles/mapbox/dark-v10', // dark theme
      // center: [103.7041631, 1.3139961], // MapComponent will call setCenter to init the map center
      zoom: 9,
    };
    const c = JSON.parse(localStorage.getItem('nm_mapbox_transform_request') || '[]');
    if (c.length > 0) {
      options.transformRequest = (url, resourceType) => {
        const replaces = c.find((r) => r.resourceTypes.indexOf(resourceType) !== -1)?.replaces;
        if (!replaces) {
          return { url };
        }
        return replaces.length === 2
          ? { url: url.replace(...replaces) }
          : { url: replaces[0] };
      };
    }
    window.mapbox = new mapboxgl.Map(options);
    // console.log('map', window.mapbox);
    window.mapbox.on('load', () => {
      console.debug('mapbox load event');
      // Another simple solution is just using icon from mapbox
      // https://stackoverflow.com/questions/61918545/how-can-i-create-a-style-with-directional-lines-in-mapbox-studio
      window.mapbox.loadImage(ARROW_URL, (err, image) => {
        if (err) {
          console.error('Failed to map.loadImage()', err);
          return;
        }
        console.debug('map.addImage', imageIdArrow);
        window.mapbox.addImage(imageIdArrow, image);
        onMapboxReady(true);
      });
    });
    window.mapbox.on('idle', () => {
      // console.debug('mapbox idle event');
    });
  }, [onMapboxReady]);

  useEffect(() => {
    window.mapbox.resize();
  }, [width]);

  const style = {};
  if (width) {
    style.width = width;
  }

  return (
    <div className="nm-map-container" style={style} ref={mapboxElRef} />
  );
}

Map.propTypes = {
  width: PropTypes.number.isRequired,
};
