<template>
  <div class="home">
    <div class="event">
      <div class="event-info">
        <div class="event-info-text">
          <div class="tagline">
            Be a part of <br />
            {{ configData.name }}
          </div>
          <div class="description">
            {{ configData.about }}
          </div>
          <div class="description">Starting Time</div>
          <div class="timing">
            {{ convertTimeFormat(configData.starting_time) }}
          </div>
          <div class="description">Ending Time</div>
          <div class="timing">
            {{ convertTimeFormat(configData.ending_time) }}
          </div>
          <router-link
            style="text-decoration: none"
            v-if="isLoggedIn()"
            to="/challenges"
          >
            <Button text="See Challenges" class="primary-cta"
          /></router-link>
          <router-link style="text-decoration: none" v-else to="/register">
            <div class="primary-cta">Register Now</div>
          </router-link>
        </div>
        <div class="event-info-img">
          <img class="landing-img" src="@/assets/landing1.svg" />
        </div>
      </div>
      <div v-if="configData.prizes" class="prize-info">
        <div class="prize-info-text">
          <div class="heading">Prizes to be won</div>
          <div class="description">
            {{ configData.prizes }}
          </div>
        </div>
        <div class="prize-info-img">
          <img class="landing-img" src="@/assets/landing2.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigApiService from "../api/admin/configureAPI";
import Button from "../components/Button.vue";
import moment from "moment-timezone";
import LoginUser from "../api/admin/authAPI.js";
export default {
  name: "home",
  components: {
    Button,
  },
  props: ["fetchedData", "configs"],
  data() {
    return {
      configData: {},
    };
  },
  beforeCreate() {
    this.$store.commit("updateCurrentPage", "userAboutCTF");
  },
  mounted() {
    if (!this.fetchedData) {
      ConfigApiService.getConfigs().then((response) => {
        this.configData = response.data;
      });
    } else {
      this.configData = this.configs;
    }
  },
  methods: {
    isLoggedIn() {
      let userInfo = LoginUser.getUserInfo();
      if (userInfo) {
        return userInfo.access && userInfo.role === "contestant";
      }
      return false;
    },
    convertTimeFormat(time) {
      return moment(time, "HH:mm:ss UTC: Z, DD MMMM YYYY, dddd").format(
        "HH:mm:ss UTC: Z, Do MMMM YYYY, dddd"
      );
    },
  },
};
</script>

<style scoped lang="scss">
button {
  margin-top: 1rem;
}
</style>
