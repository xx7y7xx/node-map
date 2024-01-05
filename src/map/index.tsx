import React, { useRef, useEffect, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { imageIdArrow, ARROW_URL } from '../constants';

/**
 * How to get token:
 * 1. Try to search on GitHut: https://github.com/search?q=mapboxgl.accessToken&type=code
 * 2. Get one from search result, it is now: https://github.com/sosbrumadinho/brumadinho_location/blob/b9a94fd9295ba5759b93ba7def584c1f39b7dde0/brumadinho_heatmap/public/js/map.js#L3
 */
mapboxgl.accessToken =
  'pk.eyJ1Ijoiam9zZWJlemVycmEiLCJhIjoiY2pyazVtdDA5MDE5czQ0cmdsNnFjZjVsdiJ9.g3x0Z17jXKFjfYEc2ivxsg';

declare global {
  interface Window {
    mapbox: mapboxgl.Map;
  }
}

type LocalStorageTransformRequest = {
  resourceTypes: string[];
  replaces: string[];
};

export default function Map({
  width,
  onMapboxReady,
}: {
  width: number;
  onMapboxReady: (ready: boolean) => void;
}) {
  const mapboxElRef = useRef<HTMLElement>(null); // DOM element to render map

  useEffect(() => {
    if (window.mapbox) {
      console.debug('mapbox already created');
      return;
    }

    if (!mapboxElRef.current) {
      console.debug('mapboxElRef.current is invalid!');
      return;
    }
    const options: MapboxOptions = {
      container: mapboxElRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      // style: 'mapbox://styles/mapbox/dark-v10', // dark theme
      // center: [103.7041631, 1.3139961], // MapComponent will call setCenter to init the map center
      zoom: 9,
    };
    const c: LocalStorageTransformRequest[] = JSON.parse(
      localStorage.getItem('nm_mapbox_transform_request') || '[]',
    );
    if (c.length > 0) {
      options.transformRequest = (url, resourceType) => {
        const replaces = c.find(
          (r: any) => r.resourceTypes.indexOf(resourceType) !== -1,
        )?.replaces;
        if (!replaces) {
          return { url };
        }
        return replaces.length === 2
          ? { url: url.replace(replaces[0], replaces[1]) }
          : { url: replaces[0] };
      };
    }
    console.debug('new mapboxgl.Map');
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
        if (!image) {
          console.error('Failed to map.loadImage(), image invalid', err);
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

  const style: CSSProperties = {};
  if (width) {
    style.width = width;
  }

  return (
    <div
      className="nm-map-container"
      style={style}
      ref={mapboxElRef as React.RefObject<HTMLDivElement>}
    />
  );
}

Map.propTypes = {
  width: PropTypes.number.isRequired,
};
