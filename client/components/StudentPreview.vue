<template>
  <v-tooltip open-delay="500" right nudge-right="10" lazy>
    <nuxt-link slot="activator" :to="{ path: '/check/student/' + id }">
      {{ name }}
    </nuxt-link>
    <div class="img-box">
      <v-img
        :src="url"
        lazy-src="http://192.168.1.232:3001/default.jpg"
        aspect-ratio="1"
      />
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
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    url() {
      return process.env.baseUrl + '/students/' + this.num + '.jpg'
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
