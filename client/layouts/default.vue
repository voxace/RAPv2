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
        {
          to: '/',
          text: 'Home',
          auth: 0,
          loggedIn: false,
          type: 'link'
        },
        {
          to: '/rubric',
          text: 'Rubric',
          auth: 0,
          loggedIn: false,
          type: 'link'
        },
        {
          text: 'Check Scores',
          to: '/check',
          auth: 1,
          loggedIn: true,
          type: 'menu',
          menu: [
            {
              to: '/check/student',
              text: 'Single Student'
            },
            {
              to: '/check/class',
              text: 'By Class Code'
            },
            {
              to: '/check/teacher',
              text: 'By Teacher'
            },
            {
              to: '/check/subject',
              text: 'By Subject'
            }
          ]
        },
        {
          text: 'Insights',
          to: '/insights',
          auth: 1,
          loggedIn: true,
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
          auth: 2,
          loggedIn: true,
          type: 'menu',
          menu: [
            {
              to: '/admin/periods',
              text: 'RAP Periods'
            },
            {
              to: '/admin/generate',
              text: 'Generate Posters'
            },
            {
              to: '/admin/teachers',
              text: 'Edit Teachers'
            }
          ]
        },
        {
          to: '/logout',
          text: 'Logout',
          auth: 0,
          loggedIn: true,
          type: 'link'
        }
      ]
    }
  },
  computed: {
    activeLinks: function() {
      let auth = this.$store.state.auth
      if (auth) {
        return this.links.filter(function(link) {
          return auth.access >= link.auth
        })
      } else {
        return this.links.filter(function(link) {
          return !link.loggedIn
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
