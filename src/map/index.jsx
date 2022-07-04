import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoibm90YWxlbWVzYSIsImEiOiJjazhiOTZnb2gwM3NxM2ZucGp1Z21mNjZ0In0.Z4nS6wdB4WzflkDItyXSIQ';

export default function Map() {
  const mapboxElRef = useRef(null); // DOM element to render map

  useEffect(() => {
    window.mapbox = new mapboxgl.Map({
      container: mapboxElRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [103.7041631, 1.3139961],
      zoom: 9,
    });
    console.log('map', window.mapbox);
  }, []);

  return (
    <div className="mapbox" ref={mapboxElRef} />
  );
}
