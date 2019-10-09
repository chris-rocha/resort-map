import Vue from 'vue'
import App from './App'
import jQuery from 'jquery';
import { mapData } from './map.data.js'

Vue.config.devtools = true

window.locationsApp = new Vue({
// const app = new Vue({
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
  props: ['mapimage'],
  watch: {
    currentLocation: function () {
      jQuery('.location-slideshow', this.$el).cycle('destroy');
      if (typeof this.currentLocation !== 'object') {
        this.showMap();
      }
    },
    lightboxMode: function() {
      if(!this.lightboxMode) {
        for (var i = 0; i < window.locationsApp.$refs.mediaslide.length; i++) {
          if (window.locationsApp.$refs.mediaslide[i].player) {
            window.locationsApp.$refs.mediaslide[i].player.pauseVideo();
          }
        }
      }
    },
    zoom: function() {
      this.map.setZoom(this.zoom);
    }
  },
  // methods: {
  //   streetLink: function (location) {
  //     return 'https://maps.google.com/maps?q=&cbll=' + location.latitude + ',' + location.longitude + '&layer=c&cbp=11,0,0,0,0';
  //   },
  //   directionsLink: function (location) {
  //     return 'https://www.google.com/maps/dir/?daddr=' + location.latitude + ',' + location.longitude;
  //   },
  //   playVideo: function(e) {
  //     var video = e.currentTarget.nextSibling;
  //     if(video && video.paused) {
  //       jQuery(video).on('ended',function(){
  //         this.currentTime = 0;
  //         this.previousSibling.classList.add('show-icon');
  //       })
  //       e.currentTarget.classList.remove('show-icon');
  //       video.play();
  //     }
  //     else if(video) {
  //       video.pause();
  //       e.currentTarget.classList.add('show-icon');
  //     }
  //   },
  //   changeLocation: function (location) {
  //     this.currentLocation = location;
  //     this.showDetail();
  //   },
  //   clickMarker: function(e) {
  //     this.changeLocation(e.target.location);
  //     this.map.panTo([e.latlng.lat, e.latlng.lng]);
  //   },
  //   changeView: function (view) {
  //     if(this.currentView != view) {
  //       this.lastView = this.currentView;
  //       this.currentView = view;
  //     }
  //   },
  //   resize: function() {
  //     if(window.innerWidth < 768) {
  //       this.map.setMinZoom(11)
  //     }
  //     else {
  //       this.map.setMinZoom(12)
  //     }
  //     this.map.setZoom(Math.max(this.map.options.zoom,this.map.options.minZoom));
  //   },
  //   showDetail: function (e) {
  //     this.changeView('detail');
  //     setTimeout(function (el) {
  //       jQuery('.location-slideshow').on('cycle-before',function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag){
  //         var currPlayer = window.locationsApp.$refs.mediaslide[optionHash.currSlide];
  //         if(currPlayer.player) {
  //           currPlayer.player.pauseVideo();
  //         }
  //         var nextPlayer = window.locationsApp.$refs.mediaslide[optionHash.nextSlide];
  //         if(nextPlayer.player) {
  //           nextPlayer.player.playVideo();
  //         }
  //       })
  //       jQuery('.location-slideshow', el[0]).cycle();
  //     }, 100, [this.$el]);
  //   },
  //   showLightbox: function(index) {
  //     if(this.currentLocation.medias) {
  //       jQuery('#slideshow-lightbox .location-slideshow').cycle('goto',index);
  //       this.lightboxMode = true;
  //     }
  //   }
  // },
  mounted: function() {
    var vueApp = this;
    this.mapimage = this.$el.getAttribute('data-mapimage').replace('gotobermuda.dev.dd:8083','www.gotobermuda.com');
    var mapBounds = [[32.426793, -64.95490], [32.211887, -64.552683]];
    var imageBounds = [[32.396793, -64.892490], [32.241887, -64.632683]];
    // L.Map.addInitHook("addHandler", "gestureHandling", leafletGestureHandling.GestureHandling);
    var map = L.map('locations-map', {
      center: [32.3139, -64.7536],
      zoom: 12,
      minZoom: 12,
      maxZoom: 15,
      zoomControl: false,
      scrollWheelZoom: false,
      gestureHandling: true
    });
    this.map = map;
    this.zoom = 12;
    this.map.fitBounds(imageBounds);

    if(this.mapimage) {
      var imageUrl = this.mapimage;
      L.imageOverlay(imageUrl, imageBounds).addTo(map);
    }

    var markers = L.markerClusterGroup({
      maxClusterRadius: 60,
      zoomToBoundsOnClick:true,
      showCoverageOnHover:false,
      spiderLegPolylineOptions: {opacity: 0},
      iconCreateFunction: function (cluster) {
        return L.divIcon({
          html: '<i class="icon-thick-plus"></i>',
          iconSize: [30, 30]
        });
      }
    });

    markers.on('animationend',function(e){
      vueApp.zoom = map.getZoom();
    })

    var marker;
    var markerIcon = L.divIcon({
      html: '<i class="icon-star"></i>',
      iconSize: [30, 30]
    });

    for(var i = 0; i < this.locations.length; i++) {
      var location = this.locations[i];
      marker = L.marker([location.latitude, location.longitude], {icon: markerIcon});
      marker.location = location;
      location.marker = marker;
      marker.on('click', this.clickMarker);
      marker.bindTooltip(location.title,{offset:[-20,0],direction:'left'});
      markers.addLayer(marker);
    }

    map.addLayer(markers);

    jQuery(window).on('resize',function(){
      vueApp.resize();
    })


  }
});
