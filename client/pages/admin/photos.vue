<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <h1 class="mb-2">Import Photos</h1>
      <v-card>
        <v-toolbar flat color="yellow darken-1">
          <v-toolbar-title>
            Choose student photos to upload:
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-layout wrap align-content-center class="mt-4">
            <v-flex xs12 sm10 px-2>
              <div class="mr-2">
                <v-text-field
                  ref="fileTextField"
                  v-model="filename"
                  label="Choose Files"
                  required="true"
                  single-line
                  prepend-icon="attach_file"
                  solo
                  @click.native="onFocus"
                />
                <input
                  ref="fileInput"
                  accept="*.jpg"
                  multiple="true"
                  type="file"
                  @change="onFileChange"
                />
              </div>
            </v-flex>
            <v-flex xs12 sm2 px-2>
              <v-btn
                :disabled="disabled"
                large
                color="primary"
                block
                @click="uploadData"
              >
                {{ buttonContent }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      uploadPercentage: 0,
      filename: '',
      value: [],
      form: null
    }
  },
  computed: {
    disabled() {
      if (this.filename == '' || this.loading == true) {
        return true
      } else {
        return false
      }
    },
    buttonContent() {
      if (this.loading == true) {
        return this.uploadPercentage + '%'
      } else {
        return 'UPLOAD'
      }
    }
  },
  watch: {
    value(v) {
      this.filename = v
    }
  },
  mounted() {
    this.filename = this.value
  },
  methods: {
    getFormData(files) {
      const data = new FormData()
      ;[...files].forEach(file => {
        data.append('Upload', file, file.name)
      })
      return data
    },
    onFocus() {
      this.$refs.fileInput.click()
    },
    onFileChange($event) {
      const files = $event.target.files || $event.dataTransfer.files
      this.form = this.getFormData(files)
      if (files) {
        if (files.length > 0) {
          this.filename = [...files].map(file => file.name).join(', ')
        } else {
          this.filename = null
        }
      } else {
        this.filename = $event.target.value.split('\\').pop()
      }
    },
    async uploadData() {
      this.loading = true
      const vm = this
      console.log(this.form)
      await this.$axios
        .post('/admin/import/photos', this.form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          }.bind(this)
        })
        .then(function() {
          vm.$store.dispatch('openSuccessBar', 'Photo Uploads Successful')
          vm.loading = false
          vm.uploadPercentage = 0
          vm.filename = ''
          vm.value = []
          vm.form = null
        })
        .catch(function() {
          vm.$store.dispatch('openErrorBar', 'Error Uploading Photos')
          vm.loading = false
        })
    }
  }
}
</script>

<style scoped>
input[type='file'] {
  position: absolute;
  left: -99999px;
}
.v-btn--block {
  margin-top: 3px;
}
</style>
