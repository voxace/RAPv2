export default function({ store, $axios, redirect }) {
  $axios.onRequest(config => {
    if (config.method != 'patch') {
      store.commit('setLoading', true)
    }
    console.log('Making request to ' + config.url) // eslint-disable-line no-console
  })

  $axios.onResponse(response => {
    store.commit('setLoading', false)
    console.log('Received response') // eslint-disable-line no-console
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
