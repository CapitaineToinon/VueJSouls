<template>
  <div v-if="youtubeID" class="speedsouls-video">
    <youtube :video-id="youtubeID" :player-vars="{ autoplay: autoPlay }"></youtube>
  </div>
  <div v-else-if="twitchID" class="speedsouls-video">
    <iframe
      :src="`https://player.twitch.tv/?video=${twitchID}&autoplay=${autoPlay}`"
      frameborder="0"
      scrolling="no"
      allowfullscreen="true"
    ></iframe>
  </div>
  <div v-else class="speedsouls-video-link pa-3 text-xs-center">
    <a :href="url" target="_blank">{{ url }}</a>
  </div>
</template>

<script>
/* eslint-disable-next-line */
const TWITCH_REGEX = /(?:http(?:s)?:\/\/(?:www.)?)?twitch.tv\/(?:(?:.+?)\/v|videos)\/([0-9]+)/;

export default {
  data() {
    return {
      youtubeID: null,
      twitchID: null,
    }
  },

  props: {
    autoPlay: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      required: true
    }
  },

  methods: {
    getYouTubeID() {
      return this.$youtube.getIdFromUrl(this.url);
    },
    getTwitchID() {
      const matches = TWITCH_REGEX.exec(this.url);
      return matches && matches[1] ? matches[1] : null;
    }
  },

  beforeMount() {
    this.youtubeID = this.getYouTubeID();
    this.twitchID = this.getTwitchID();
  },
};
</script>

<style>
/**
 * Scoped CSS Doesn't work on dynamic content 
 * https://github.com/vuejs/vue-loader/issues/559
 */
.speedsouls-video {
  width: 100%;
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}

.speedsouls-video iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
