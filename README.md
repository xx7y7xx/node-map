# node-map

Use node editor to control data transform then visualize on the map.

![](node-map.png)

## Nodes

* Auth Node - Setup global auth token (used in Remote Data Node)
* Transform Eval Node - Write script to transfer js object from format A to format B
* Turf LineString Node - Call turfjs to convert array of coordinates into GeoJSON
* Map GeoJSON Node - Create a GeoJSON data source in mapbox
* Map Layer Node - Render map with input data source ID.

## Start dev

```
$ npm start
```

test production build at local

```
$ npm run build-localhost
```