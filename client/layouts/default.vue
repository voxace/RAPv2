<template>
  <v-app light>
    <MainToolBar :active-links="activeLinks" />
    <NavDrawer :active-links="activeLinks" />
    <v-content>
      <v-container
        fluid
        fill-height>
        <Loader v-show="loading" />
        <nuxt v-show="!loading"/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MainToolBar from '@/components/layout/MainToolBar'
import NavDrawer from '@/components/layout/NavDrawer'
import Loader from '@/components/layout/Loader'

export default {
  components: {
    MainToolBar,
    NavDrawer,
    Loader
  },
  data() {
    return {
      links: [
        { to: '/', text: 'Home', auth: true, type: 'link' },
        { to: '/rubric', text: 'Rubric', auth: false, type: 'link' },
        {
          text: 'Check Scores',
          to: '/check',
          auth: true,
          type: 'menu',
          menu: [
            {
              to: '/check/student',
              text: 'Single Student'
            },
            {
              to: '/check/class',
              text: 'By Class'
            },
            {
              to: '/check/teacher',
              text: 'By Teacher'
            }
          ]
        },
        {
          text: 'Insights',
          to: '/insights',
          auth: true,
          type: 'menu',
          menu: [
            {
              to: '/insights/cohort-averages',
              text: 'Cohort Averages'
            },
            {
              to: '/insights/whole-school',
              text: 'Whole School'
            }
          ]
        },
        {
          text: 'Admin',
          to: '/admin',
          auth: true,
          type: 'menu',
          menu: [
            {
              to: '/admin/periods',
              text: 'RAP Periods'
            },
            {
              to: '/admin/generate',
              text: 'Generate Posters'
            }
          ]
        },
        { to: '/logout', text: 'Logout', auth: true, type: 'link' }
      ]
    }
  },
  computed: {
    activeLinks: function() {
      if (this.$store.state.auth) {
        return this.links
      } else {
        return this.links.filter(function(l) {
          return !l.auth
        })
      }
    },
    loading() {
      return this.$store.state.loading
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.theme--light.application {
  background: #fff;
}
table.v-table tbody td,
table.v-table tbody th {
  height: 42px !important;
}
</style>
