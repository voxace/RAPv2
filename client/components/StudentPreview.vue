<template>
  <v-tooltip open-delay="200" right nudge-right="10">
    <nuxt-link slot="activator" :to="{ path: '/check/student/' + id }">
      {{ name }}
    </nuxt-link>
    <div class="img-box">
      <v-img
        v-if="error == false"
        :src="url"
        :lazy-src="defaultImage"
        aspect-ratio="1"
        @error="showDefaultOnError"
      />
      <v-img v-else :src="defaultImage" aspect-ratio="1" />
    </div>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: function() {
        return ''
      }
    },
    id: {
      type: String,
      default: function() {
        return ''
      }
    },
    num: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {
      error: false
    }
  },
  computed: {
    url() {
      let url = process.env.baseUrl + '/students/' + this.num + '.jpg'
      if (this.UrlExists(url)) {
        return url
      } else {
        return process.env.baseUrl + '/default.jpg'
      }
    },
    defaultImage() {
      return process.env.baseUrl + '/default.jpg'
    }
  },
  methods: {
    showDefaultOnError() {
      this.error = true
    },
    UrlExists(url) {
      var http = new XMLHttpRequest()
      http.open('HEAD', url, false)
      http.send()
      return http.status != 404
    }
  }
}
</script>

<style>
.img-box {
  width: 120px;
  height: 120px;
}
</style>
