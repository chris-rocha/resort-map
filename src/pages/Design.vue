<template>
<main id="content" role="main" class="landing-max-width">
<div class="container">
    <p>Just some thumbnails of the work I've done over the years. If you would like to see more, please give me a call at 813-545-1429.</p>
    <hr />
<!--      <ul class="three gd">

<li v-for="(design, index) in gd">
<img class="scale-with-grid" :src="design.file" :alt="design.type" />
      <div class="caption">
      <h4>{{ index }} {{ design.type }}</h4>
      </div>
</li>
    </ul> -->

<transition-group tag="ul" class="three gd" name="bounce">
  <li v-for="(design, index) in gd" :key="`key-${index}`">
    <img class="scale-with-grid" :src="design.file" :alt="design.type" />
    <div class="caption">
    <h4>{{ design.type }}</h4>
    </div>
  </li>
</transition-group>

</div>
</main>
</template>

<script>
export default {
    name: "Design",
    data: function() {
        return { gd: Settings.design }
    }
};
</script>
