import Vue from 'vue'
import App from './App'
import jQuery from 'jquery';
import { mapData } from './map.data.js'
window.$ = window.jQuery = jQuery;

Vue.config.devtools = true

var vm = new Vue({
  components: { App },
  template: '<App/>',
  el: "#map-outer-wrapper",
  data: {
    locations: mapData,
    currentLocation: null,
    currentView: 'map',
    lastView: 'map',
    lightboxMode:false,
    map: null,
    zoom: 12
  },
  props: ['mapimage']
});
