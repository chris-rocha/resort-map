<template>
<div id="map-outer-wrapper"
     v-bind:class="{'show-summaries': currentView == 'summaries', 'show-detail': currentView == 'detail'}"
     data-mapimage="https://www.gotobermuda.com/sites/default/files/winter-map-3.svg">
  <div id="map-wrapper">
    <div id="map-header">
      <h2 class="remove-bottom">Map Header</h2>
    </div>
    <div id="map-body">
      <div id="locations-map" v-on:click="changeView('map')"></div>
    </div>
    <div id="map-controls">
      <button class="leaflet-zoom-in button"
              v-on:click="zoom += 1">+<i class="icon-plus"></i></button>
      <button class="leaflet-zoom-out button"
              v-on:click="zoom -= 1">-<i class="icon-minus"></i></button>
      <button class="show-locations button arrow"
              v-on:click="changeView('summaries')">
        <span>See All Locations</span><i class="icon-thick-triangle-right"></i>
      </button>
    </div>
    <div id="location-summaries">
      <div class="content">
        <div class="top-bar flex-center center-text fill blue">
          <h4 class="color white remove-bottom">Location Type</h4>
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
              <a class="button blue" target="_blank" href="javascript:void(0)"
                 v-if="location.showDirections" v-bind:href="directionsLink(location)">Directions</a>
              <a class="button blue" href="javascript:void(0)"
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
        <div v-if="currentLocation" class="location-detail-inner">
          <div class="detail-column">
            <header class="flex-center add-bottom">
              <button class="show-map" aria-label="Back to Map"
                      v-on:click="changeView('map')"><i class="icon-bermuda"></i>Map</button>
              <button class="show-locations" aria-label="See All Locations"
                      v-on:click="changeView('summaries')"><i class="icon-list-bullet"></i>List</button>
              <h2>{{currentLocation.title}}</h2>
            </header>
            <div class="location-slideshow"
                 data-cycle-next="> .cycle-next"
                 data-cycle-prev="> .cycle-prev"
                 data-cycle-pager="> .cycle-pager"
                 data-cycle-timeout="0"
                 data-cycle-slides="> .location-media">
              <div class="location-media" v-for="(media,index) in currentLocation.medias">
                <div v-if="media.type == 'image'" v-on:click="showLightbox(index)"><i class="icon-expand color white"></i><img src="" title="" v-bind:src="media.src" v-bind:title="media.caption" width="100%" height="100" /></div>
                <div v-else-if="media.type == 'youtube'" v-on:click="showLightbox(index)"><div class="icon"><i class="icon-play"></i></div><img src="" title="" v-bind:src="'https://img.youtube.com/vi/'+media.ytid+'/hqdefault.jpg'" v-bind:title="media.caption" width="100%" height="100" /></div>
              </div>
              <a class="cycle-prev" href="javascript:void(0)"
                 v-if="currentLocation.medias.length > 1"><i class="icon-thick-triangle-left"></i></a>
              <a class="cycle-next" href="javascript:void(0)"
                 v-if="currentLocation.medias.length > 1"><i class="icon-thick-triangle-right"></i></a>
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
            <button class="close-button blue-solid full-width add-bottom" aria-label="Return to Last View"
                    v-on:click="changeView(lastView)">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="slideshow-lightbox" v-if="currentLocation" v-bind:class="{'show':lightboxMode}" v-on:click.self="lightboxMode = false">
      <div class="location-slideshow" data-cycle-next="> .cycle-next" data-cycle-prev="> .cycle-prev" data-cycle-pager="> .cycle-pager" data-cycle-timeout="0" data-cycle-slides="> .location-media">
        <div class="location-media" v-for="(media,index) in currentLocation.medias">
          <figure ref="mediaslide" v-if="media.type == 'image'"><img src="" title="" v-bind:src="media.src" /><figcaption>{{media.caption}}</figcaption></figure>
          <figure v-else-if="media.type == 'youtube'"><youtube ref="mediaslide" :video-id="media.ytid" :player-vars="{autoplay:0,controls:0,showinfo:0,modestbranding:1,wmode:'transparent',rel:0}"></youtube><figcaption>{{media.caption}}</figcaption></figure>
        </div>
        <a class="cycle-prev" href="javascript:void(0)"
           v-if="currentLocation.medias.length"><i class="icon-thick-triangle-left"></i></a>
        <a class="cycle-next" href="javascript:void(0)"
           v-if="currentLocation.medias.length"><i class="icon-thick-triangle-right"></i></a>
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
import { MarkerClusterGroup } from 'leaflet.markercluster'

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
    }
}

</script>
