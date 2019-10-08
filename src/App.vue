<template>
<div id=custom-map>
    <div class=container>
        <div class="text-center animated fadeInUp">
            <h1 class="text-center">{{ mapData.title }}</h1>
        </div>
    </div>
</div>
</template>

<script>
import { mapData } from './map.data.js'

export default {
    name: 'App',
    data: function () {
      return {
        mapData: mapData
      }
    }
}
</script>
