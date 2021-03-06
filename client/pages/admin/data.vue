<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <h1 class="mb-2">Import Data</h1>
      <v-card>
        <v-toolbar flat color="yellow darken-1">
          <v-toolbar-title>
            Choose file and data type to import:
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-layout wrap align-content-center class="mt-4">
            <v-flex xs12 sm5 px-2>
              <div class="mr-2">
                <v-text-field
                  ref="fileTextField"
                  v-model="filename"
                  label="Choose File"
                  required="true"
                  single-line
                  prepend-icon="attach_file"
                  solo
                  @click.native="onFocus"
                />
                <input
                  ref="fileInput"
                  accept="*"
                  multiple="false"
                  type="file"
                  @change="onFileChange"
                />
              </div>
            </v-flex>
            <v-flex xs12 sm5 px-2>
              <v-select
                :items="items"
                v-model="selectedItem"
                label="Choose Data Type"
                solo
              />
            </v-flex>
            <v-flex xs12 sm2 px-2>
              <v-btn
                :disabled="disabled"
                large
                color="primary"
                block
                @click="uploadData"
              >
                UPLOAD
              </v-btn>
            </v-flex>
            <v-flex xs5 px-2>
              <h3>Sentral Instructions</h3>
              <ul>
                <li>
                  Ensure a new period has been set up at
                  <a href="http://mhsrap.com/admin/periods">RAP Periods</a>
                </li>
                <li>
                  Visit
                  <a href="https://mullumbimbyhs.sentral.com.au/reports/"
                    >Sentral Reports</a
                  >
                </li>
                <li>Choose the appropriate RAP reporting period</li>
                <li>Go to Export Data --> Student Grade Distribution</li>
                <li>Modify the setting as shown in the picture</li>
                <li>Export the CSV file</li>
                <li>Import above</li>
              </ul>
            </v-flex>
            <v-flex xs7 pa-3>
              <v-img :src="url" class="elevation-2" />
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
      filename: '',
      value: [],
      items: ['Sentral', 'EMU'],
      selectedItem: null,
      form: null
    }
  },
  computed: {
    disabled() {
      if (this.filename == '' || this.selectedItem == null) {
        return true
      } else {
        return false
      }
    },
    url() {
      return process.env.baseUrl + '/sentral.jpg'
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
      let type
      if (this.selectedItem == 'Edval') {
        type = 'edval'
      } else if (this.selectedItem == 'EMU') {
        type = 'emu'
      } else if (this.selectedItem == 'LMBR') {
        type = 'lmbr'
      } else if (this.selectedItem == 'Old RAP') {
        type = 'old'
      } else if (this.selectedItem == 'Spreadsheet') {
        type = 'spreadsheet'
      } else if (this.selectedItem == 'Sentral') {
        type = 'sentral'
      }
      const vm = this
      await this.$axios
        .post('/admin/import/' + type, this.form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function() {
          vm.$store.dispatch('openSuccessBar', 'Data Upload Successful')
        })
        .catch(function() {
          vm.$store.dispatch('openErrorBar', 'Error Uploading Data')
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
