import Vue from 'vue';
import Vue2Leaflet from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.component('l-map', Vue2Leaflet.LMap);
Vue.component('l-tilelayer', Vue2Leaflet.LTileLayer);
Vue.component('l-marker', Vue2Leaflet.LMarker);
Vue.component('l-tooltip', Vue2Leaflet.LTooltip);
Vue.component('l-control-zoom', Vue2Leaflet.LControlZoom);
Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster);
