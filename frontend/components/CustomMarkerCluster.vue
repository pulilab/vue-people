<script>
import { findRealParent, propsBinder, L } from 'vue2-leaflet';
import 'leaflet.markercluster';

export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      ready: false
    };
  },
  mounted () {
    this.mapObject = L.markerClusterGroup(this.options);
    L.DomEvent.on(this.mapObject, this.$listeners);
    propsBinder(this, this.mapObject, this.$options.props);
    this.parentContainer = findRealParent(this.$parent);
    this._layerAdded = 0;
    this._appended = false;
    this.ready = true;
  },
  beforeDestroy () {
    if (this._appended) {
      this.parentContainer.removeLayer(this);
    }
  },
  methods: {
    addLayer (layer, alreadyAdded) {
      if (!alreadyAdded) {
        this.mapObject.addLayer(layer.mapObject);
        this._layerAdded += 1;
        this.appendToMap();
      }
    },
    removeLayer (layer, alreadyRemoved) {
      if (!alreadyRemoved) {
        this.mapObject.removeLayer(layer.mapObject);
      }
    },
    appendToMap () {
      if (this._layerAdded >= this.total && !this._appended) {
        this.parentContainer.addLayer(this);
        this._appended = true;
      }
    }
  },
  render: function (h) {
    if (this.$slots.default && this.ready) {
      return h('div', { style: { display: 'none' } }, this.$slots.default);
    }
    return null;
  }
};
</script>
