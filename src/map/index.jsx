import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoibm90YWxlbWVzYSIsImEiOiJjazhiOTZnb2gwM3NxM2ZucGp1Z21mNjZ0In0.Z4nS6wdB4WzflkDItyXSIQ';

export default function Map({ width }) {
  const mapboxElRef = useRef(null); // DOM element to render map

  useEffect(() => {
    window.mapbox = new mapboxgl.Map({
      container: mapboxElRef.current,
      // style: 'mapbox://styles/mapbox/light-v10',
      style: 'mapbox://styles/mapbox/dark-v10', // dark theme
      center: [103.7041631, 1.3139961],
      zoom: 9,
    });
    // console.log('map', window.mapbox);
    window.mapbox.on('load', () => {
      // console.debug('mapbox load event');
      window.mapboxReady = true;
    });
    window.mapbox.on('idle', () => {
      // console.debug('mapbox idle event');
    });
  }, []);

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
