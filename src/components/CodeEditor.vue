<template>
  <div>
    <div id="code-editor-root">
      <LoadingOverlay
        :is-loading="isLoading"
      />
      <div id="editor-container">
        <PrismEditor
          v-model="code"
          class="my-editor"
          :language="progLang"
          line-numbers
          :tab-size="tabSize"
          :insert-spaces="insertSpaces"
          :highlight="highlighter"
        />
      </div>
      <div
        id="console-output"
        ref="consoleOutput"
      >
        <BlockButton
          id="run-btn"
          class="btn"
          :click="runCode"
        >
          <FontAwesomeIcon
            icon="play"
          />
          Run
        </BlockButton>
        <BlockButton
          id="reset-btn"
          class="btn"
          :click="runReset"
          color="gray"
        >
          <FontAwesomeIcon
            icon="undo"
          />
          Reset
        </BlockButton>
        <p
          v-for="(line, i) of output"
          :key="i"
          :class="{error: err}"
        >
          {{ line }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike.min';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-go.min';
import 'prismjs/components/prism-rust.min';
import 'prismjs/components/prism-python.min';
import 'prismjs/components/prism-haskell.min'; // required for purescript
import 'prismjs/components/prism-purescript.min';
import 'prismjs/themes/prism-tomorrow.css';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import BlockButton from '@/components/BlockButton';
import LoadingOverlay from '@/components/LoadingOverlay';
import { getWorker, useWorker, terminateWorker } from '@/lib/runWorker.js';
import { 
  compileGo,
  compileRust,
  compilePureScript
} from '@/lib/cloudClient.js';

export default {
  components: {
    PrismEditor,
    FontAwesomeIcon,
    LoadingOverlay,
    BlockButton
  },
  props: {
    runCallback: {
      type: Function,
      required: true
    },
    resetCallback: {
      type: Function,
      required: true
    },
    progLang: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      code: '',
      output: [],
      err: false,
      isLoading: false,
      worker: getWorker(this.getWorkerLang(this.progLang))
    };
  },
  computed: {
    tabSize(){
      if (this.progLang === 'go' || this.progLang == 'py'){
        return 1; // because its a tab
      }
      return 2;
    },
    insertSpaces(){
      return this.progLang === 'js' || 
        this.progLang === 'purs' ||
        this.progLang === 'rs';
    }
  },
  watch: { 
    progLang(newLang) {
      terminateWorker(this.worker);
      this.worker = getWorker(this.getWorkerLang(newLang));
    }
  },
  methods: {
    getWorkerLang(progLang){
      if (progLang === 'purs'){
        return 'js';
      }
      return progLang;
    },
    scrollToEnd () {
      requestAnimationFrame(() => {
        var content = this.$refs.consoleOutput;
        content.scrollTop = Number.MAX_SAFE_INTEGER;
      });
    },
    highlighter(code) {
      return highlight(code, languages[this.progLang]);
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    setCode(code){
      this.code = code;
    },
    async runCode() {
      try {
        this.output = [];
        this.isLoading = true;

        if (this.progLang === 'go'){
          try {
            const wasm = await compileGo(this.code);
            await useWorker(this.worker, wasm, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(err);
            throw err;
          }
        } else if (this.progLang === 'rs'){
          try {
            const wasm = await compileRust(this.code);
            await useWorker(this.worker, wasm, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(err);
            throw err;
          }
        } else if (this.progLang === 'purs'){
          try {
            const resp = await compilePureScript(this.code);
            await useWorker(this.worker, resp.Code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(err);
            throw err;
          }
        } else if (this.progLang === 'js'){
          // make it feel like something is running
          await this.sleep(250);
          try {
            await useWorker(this.worker, this.code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(JSON.stringify(err));
            throw err;
          }
        } else if (this.progLang === 'py'){
          await this.sleep(250);
          try {
            await useWorker(this.worker, this.code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(JSON.stringify(err));
            throw err;
          }
        }

        this.err = false;
        this.isLoading = false;
        let finalOut = '';
        for (const line of this.output){
          if (Array.isArray(line) || typeof line === 'object'){
            finalOut += JSON.stringify(line);
          } else{
            finalOut+=line;
          }
        }
        await this.runCallback(finalOut);
      } catch(err) {
        this.isLoading = false;

        let errString = err;
        if (typeof err !== 'string'){
          errString = err.toString();
        }

        const errLines = errString.split(/\r?\n/);

        this.output = errLines;
        this.err = true;
      }
    },
    async runReset() {
      try {
        await this.resetCallback(this.output.join(''));
      } catch(err) {
        this.output = null;
        this.err = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/colors.scss';

span.token.operator {
  background: inherit !important;
}

.my-editor {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;

  .prism-editor__textarea:focus {
    outline: none;
  }
}

#code-editor-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  #editor-container {
    flex: 4;
    overflow: auto;
  }

  #console-output {
    background-color: $gray-darkest;
    flex: 2;
    flex-direction: column;
    padding: 10px;
    overflow: auto;

    .btn {
      float: right;
      margin-left: 1em;
      font-size: 1em;
      top: 0;
      position: sticky;
    }

    p {
      margin: 0;
      font-size: 1em;
      color: $white;
    }

    .error {
      color: $pink-light;
    }
  }
}

</style>
