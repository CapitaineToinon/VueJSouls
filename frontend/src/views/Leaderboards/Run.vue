<template>
  <v-layout v-if="isLoaded" wrap>
    <v-flex xs12>
      <v-card class="run-card">
        <div v-if="hasVideos">
          <run-video v-for="(link, i) in videos" :key="i" :url="link.uri"></run-video>
        </div>
        <div v-else>
          <v-alert :value="true" type="info">No videos.</v-alert>
        </div>
        <v-card-title>
          <div>
            <span class="headline font-weight-bold">
              {{ category.name }} {{ runTime }} by
              <player-name v-for="(player, index) in players" :key="index" :player="player"></player-name>
            </span>
            <span class="grey--text" v-if="data.comment">
              <br>
              {{ data.comment }}
            </span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="primary" :href="data.weblink" target="_blank">watch on speedrun.com</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex xs12 text-xs-center>
      <loader/>
    </v-flex>
  </v-layout>
</template>

<script>
import api from "@/api/speedruncom.js";
import RunVideo from "@/components/RunVideo";
import filters from "@/api/filters.js";
import { mapActions } from "vuex";
import PlayerName from "@/components/PlayerName";

export default {
  name: "runpage",

  components: {
    RunVideo,
    PlayerName
  },

  data() {
    return {
      data: null
    };
  },

  computed: {
    isLoaded() {
      return this.data !== null;
    },
    game() {
      return this.data.game.data;
    },
    category() {
      return this.data.category.data;
    },
    runTime() {
      return filters.formatTime(this.data.times.primary_t);
    },
    players() {
      return this.data.players;
    },
    hasVideos() {
      return this.videos.length > 0;
    },
    videos() {
      return this.data.videos ? this.data.videos.links : [];
    },
    title() {
      const playerNames = this.players.map(player => player.name).join(", ");
      return `${this.category.name} ${this.runTime} by ${playerNames}`;
    }
  },

  methods: {
    ...mapActions({
      setBreadcrumbs: "breadcrumbs/setBreadcrumbs"
    })
  },

  activated() {
    this.data = null;
    api
      .getRun(this.$route.params.id)
      .then(data => {
        this.data = data;

        /**
         * Update breadcrumbs
         */
        this.setBreadcrumbs(
          this.$breadcrumbs("run", {
            game: this.game,
            run: this.title
          })
        );

        window.document.title = `SpeedSouls - ${this.title}`;
      })
      .catch(error => {
        this.$router.push({
          name: "leaderboard",
          params: {
            abbreviation: this.$route.params.abbreviation
          }
        });
      });
  }
};
</script>
