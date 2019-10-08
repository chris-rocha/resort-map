<template>
<main id="content" role="main" class="landing-max-width">
<div class="container">
    <ul class="three">
      <li v-for="c in code">
      <a target="_blank" :href="c.link" :title="c.title">
        <img :alt="c.title" class="scale-with-grid" :src="c.thumb" />
      <div class="caption">
      <h4>{{ c.title }}</h4>
      <div class="details">{{ c.details}}</div>
      </div>
      </a>
      </li>
    </ul>
</div>
</main>
</template>

<script>
export default {
    name: "Code",
    data: function() {
        return { code: Settings.code }
    }
};
</script>
