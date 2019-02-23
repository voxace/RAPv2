<template>
  <v-layout 
    wrap 
    align-content-start
  >  
    <v-flex xs12>  
      <h1 class="mb-2">Import Data</h1>
      <v-card>
        <v-toolbar
          flat
          color="yellow darken-1"
        >
          <v-toolbar-title>Choose file and data type to import:</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-layout 
            wrap
            align-content-center
            class="mt-4"
          >
            <v-flex 
              xs12
              sm5
              px-2
            >
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
                >
              </div>
            </v-flex>
            <v-flex 
              xs12
              sm5
              px-2
            >
              <v-select
                :items="items"
                v-model="selectedItem"
                label="Choose Data Type"
                solo
              />
            </v-flex>
            <v-flex 
              xs12
              sm2
              px-2
            >
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
      items: ['Edval', 'EMU', 'LMBR', 'Old RAP'],
      selectedItem: null
    }
  },
  computed: {
    disabled() {
      if (this.filename == '' || this.selectedItem == null) {
        return true
      } else {
        return false
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
        data.append('data', file, file.name)
      })
      return data
    },
    onFocus() {
      this.$refs.fileInput.click()
    },
    onFileChange($event) {
      const files = $event.target.files || $event.dataTransfer.files
      const form = this.getFormData(files)
      if (files) {
        if (files.length > 0) {
          this.filename = [...files].map(file => file.name).join(', ')
        } else {
          this.filename = null
        }
      } else {
        this.filename = $event.target.value.split('\\').pop()
      }
      this.$emit('input', this.filename)
      this.$emit('formData', form)
    },
    async uploadData() {
      if (this.selectedItem == 'Edval') {
        await this.uploadEdval()
      } else if (this.selectedItem == 'EMU') {
        await this.uploadEMU()
      } else if (this.selectedItem == 'LMBR') {
        await this.uploadLMBR()
      } else if (this.selectedItem == 'Old RAP') {
        await this.uploadRAP()
      }
    },
    async uploadEdval() {
      alert('edval')
    },
    async uploadEMU() {
      alert('emu')
    },
    async uploadLMBR() {
      alert('lmbr')
    },
    async uploadRAP() {
      alert('rap')
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
