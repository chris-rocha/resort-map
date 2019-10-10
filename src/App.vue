<template>
<div id="map-outer-wrapper"
     v-bind:class="{'show-summaries': currentView == 'summaries', 'show-detail': currentView == 'detail'}"
     data-mapimage="https://www.gotobermuda.com/sites/default/files/winter-map-3.svg">
  <div id="map-wrapper">
    <div id="map-body">
      <div id="locations-map" v-on:click="changeView('map')"></div>
    </div>
    <div id="map-controls">
      <button class="leaflet-zoom-in button"
              v-on:click="zoom += 1"><i class="fa fa-plus" aria-hidden="true"></i></button>
      <button class="leaflet-zoom-out button"
              v-on:click="zoom -= 1"><i class="fa fa-minus" aria-hidden="true"></i></button>
      <button class="show-locations button arrow"
              v-on:click="changeView('summaries')">
        <span>See All Locations</span> <i class="fa fa-angle-right" aria-hidden="true"></i>
      </button>
    </div>
    <div id="location-summaries">
      <div class="content">
        <div class="top-bar flex-center center-text">
          <h4 class="color white remove-bottom">All Locations</h4>
        </div>
        <div class="location-summaries-inner">
          <div class="location-summary" v-for="(location,key) in locations" v-bind:key="location.id">
            <div class="location-summary-header" v-on:click="changeLocation(location)">
              <img
                  v-if="location.thumbnail"
                  v-bind:src="location.thumbnail" alt=""/>
              <h6>{{location.title}}</h6>
            </div>
            <div class="buttons">
              <a class="button" target="_blank" href="javascript:void(0)"
                 v-if="location.showDirections" v-bind:href="directionsLink(location)">Directions</a>
              <a class="button green" href="javascript:void(0)"
                  v-on:click="changeLocation(location)">Learn More</a>
            </div>
          </div>
        </div>
        <div class="bottom-bar flex-center center-text">
          <a class="close-button button arrow" href="javascript:void(0)"
                  v-on:click="changeView('map')">Back to Map</a>
        </div>
      </div>
    </div>
    <div id="location-detail">
      <div class="content">
        <div class="top-bar flex-center center-text">

        </div>
        <div v-if="currentLocation" :key="currentLocation.id" class="location-detail-inner">
          <div class="detail-column">
            <header class="flex-center add-bottom">
              <button class="show-map" aria-label="Back to Map"
                      v-on:click="changeView('map')"><i class="fa fa-globe" aria-hidden="true"></i> Map</button>
              <button class="show-locations" aria-label="See All Locations"
                      v-on:click="changeView('summaries')"><i class="fa fa-list" aria-hidden="true"></i> List</button>
              <h2>{{currentLocation.title}}</h2>
            </header>
            <div class="location-slideshow"
                 data-cycle-next="> .cycle-next"
                 data-cycle-prev="> .cycle-prev"
                 data-cycle-pager="> .cycle-pager"
                 data-cycle-timeout="0"
                 data-cycle-slides="> .location-media">
              <div class="location-media" v-for="(media,index) in currentLocation.medias">
                <div v-if="media.type == 'image'" v-on:click="showLightbox(index)"><i class="fa fa-expand color white"></i><img src="" title="" v-bind:src="media.src" v-bind:title="media.caption" width="100%" height="100" /></div>
                <div v-else-if="media.type == 'youtube'" v-on:click="showLightbox(index)"><div class="icon"><i class="fa fa-play-circle"></i></div><img src="" title="" v-bind:src="'https://img.youtube.com/vi/'+media.ytid+'/hqdefault.jpg'" v-bind:title="media.caption" width="100%" height="100" /></div>
              </div>
              <a class="cycle-prev" href="javascript:void(0)"
                 v-if="currentLocation.medias.length > 1"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
              <a class="cycle-next" href="javascript:void(0)"
                 v-if="currentLocation.medias.length > 1"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
              <div class="cycle-pager"
                   v-if="currentLocation.medias.length > 1"></div>

            </div>
            <div class="center-text">
              <a class="button street-view arrow" target="_blank" href="javascript:void(0)"
                 v-if="currentLocation.showStreetView" v-bind:href="streetLink(currentLocation)">See Street View</a>
            </div>
          </div>
          <div class="detail-column">
            <div class="location-text"
                 v-html="currentLocation.body"></div>
            <a class="button full-width add-bottom"
               v-for="button in currentLocation.buttons"
               href="javascript:void(0)"
               v-bind:href="button.url"
               v-bind:target="button.target">{{button.text}}</a>
            <div class="location-listings" v-if="currentLocation.listings.length">
              <h3>What's <em>Nearby</em></h3>
              <div class="listing add-bottom" v-for="listing in currentLocation.listings">
                <img v-if="listing.image" src="" v-bind:src="listing.image" alt="" />
                <div class="info">
                  <h4 class="all-caps remove-bottom">{{ listing.name }}</h4>
                  <p class="smaller">{{ listing.address }}</p>
                  <a class="button arrow" href="javascript:void(0)" v-bind:href="listing.url">Learn More</a>
                </div>
              </div>
            </div>
            <button class="close-button button orange full-width" aria-label="Return to Last View"
                    v-on:click="changeView(lastView)">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="slideshow-lightbox" v-if="currentLocation" :key="currentLocation.id" v-bind:class="{'show':lightboxMode}" v-on:click.self="lightboxMode = false">
      <div class="location-slideshow" data-cycle-next="> .cycle-next" data-cycle-prev="> .cycle-prev" data-cycle-pager="> .cycle-pager" data-cycle-timeout="0" data-cycle-slides="> .location-media">
        <div class="location-media" v-for="(media,index) in currentLocation.medias">
          <figure ref="mediaslide" v-if="media.type == 'image'"><img src="" title="" v-bind:src="media.src" /><figcaption>{{media.caption}}</figcaption></figure>
          <figure v-else-if="media.type == 'youtube'"><youtube ref="mediaslide" :video-id="media.ytid" :player-vars="{autoplay:0,controls:0,showinfo:0,modestbranding:1,wmode:'transparent',rel:0}"></youtube><figcaption>{{media.caption}}</figcaption></figure>
        </div>
        <a class="cycle-prev" href="javascript:void(0)"
           v-if="currentLocation.medias.length"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
        <a class="cycle-next" href="javascript:void(0)"
           v-if="currentLocation.medias.length"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
        <div class="cycle-pager"
             v-if="currentLocation.medias.length"></div>
        <a class="close color white all-caps" href="javascript:void(0)"
           v-on:click="lightboxMode = false">Close</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapData } from './map.data.js'
import { CRS } from "leaflet";
import { LMap, LImageOverlay, LMarker, LPopup, LPolyline } from "vue2-leaflet";
import { MarkerClusterGroup } from 'leaflet.markercluster';
import { GestureHandling } from "leaflet-gesture-handling";
import jQuery from 'jquery';
require('jquery.cycle2');

export default {
    name: 'App',
    data: function () {
      return {
        // mapData: mapData
        locations: mapData,
        currentLocation: null,
        currentView: 'map',
        lastView: 'map',
        lightboxMode:false,
        map: null,
        zoom: 12
      }
    },
  methods: {
    streetLink: function (location) {
      return 'https://maps.google.com/maps?q=&cbll=' + location.latitude + ',' + location.longitude + '&layer=c&cbp=11,0,0,0,0';
    },
    directionsLink: function (location) {
      return 'https://www.google.com/maps/dir/?daddr=' + location.latitude + ',' + location.longitude;
    },
    playVideo: function(e) {
      var video = e.currentTarget.nextSibling;
      if(video && video.paused) {
        jQuery(video).on('ended',function(){
          this.currentTime = 0;
          this.previousSibling.classList.add('show-icon');
        })
        e.currentTarget.classList.remove('show-icon');
        video.play();
      }
      else if(video) {
        video.pause();
        e.currentTarget.classList.add('show-icon');
      }
    },
    changeLocation: function (location) {
      this.currentLocation = location;
      this.showDetail(location);
    },
    clickMarker: function(e) {
      this.changeLocation(e.target.location);
      this.map.panTo([e.latlng.lat, e.latlng.lng]);
    },
    changeView: function (view) {
      if(this.currentView != view) {
        this.lastView = this.currentView;
        this.currentView = view;
      }
    },
    resize: function() {
      if(window.innerWidth < 768) {
        this.map.setMinZoom(11)
      }
      else {
        this.map.setMinZoom(12)
      }
      this.map.setZoom(Math.max(this.map.options.zoom,this.map.options.minZoom));
    },
    showDetail: function (e) {
      this.changeView('detail');
      const that = this.$refs;
      setTimeout(function (el) {
        jQuery('.location-slideshow').on('cycle-before',function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag){
          var currPlayer = that.mediaslide[optionHash.currSlide];
          if(currPlayer.player) {
            currPlayer.player.pauseVideo();
          }
          var nextPlayer = that.mediaslide[optionHash.nextSlide];
          if(nextPlayer.player) {
            nextPlayer.player.playVideo();
          }
        });
        jQuery('.location-slideshow').cycle();
      }, 100);
    },
    showLightbox: function(index) {
      if(this.currentLocation.medias) {
        jQuery('#slideshow-lightbox .location-slideshow').cycle('goto',index);
        this.lightboxMode = true;
      }
    }
  },
  mounted: function() {
    var vueApp = this;
    this.mapimage = this.$el.getAttribute('data-mapimage');//.replace('gotobermuda.dev.dd:8083','www.gotobermuda.com');
    var mapBounds = [[32.426793, -64.95490], [32.211887, -64.552683]];
    var imageBounds = [[32.396793, -64.892490], [32.241887, -64.632683]];
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
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
          html: '<i class="fa fa-plus" aria-hidden="true"></i>',
          iconSize: [30, 30]
        });
      }
    });

    markers.on('animationend',function(e){
      vueApp.zoom = map.getZoom();
    })

    var marker;
    var markerIcon = L.divIcon({
      html: '<i class="fa fa-star" aria-hidden="true"></i>',
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


  },
  watch: {
    currentLocation: function () {
      jQuery('.location-slideshow', this.$el).cycle('destroy');
      if (typeof this.currentLocation !== 'object') {
        this.showMap();
      }
    },
    lightboxMode: function() {
      if(!this.lightboxMode) {
        for (var i = 0; i < this.$refs.mediaslide.length; i++) {
          if (this.$refs.mediaslide[i].player) {
            this.$refs.mediaslide[i].player.pauseVideo();
          }
        }
      }
    },
    zoom: function() {
      this.map.setZoom(this.zoom);
    }
  }
}

</script>
