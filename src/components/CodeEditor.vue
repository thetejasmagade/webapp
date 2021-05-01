<template>
  <div>
    <LoadingOverlay
      :is-loading="isLoading"
      :cancel="cancelCode"
    />
    <div class="code-editor-root">
      <Multipane layout="vertical">
        <div class="editor-container">
          <PrismEditor
            v-model="code"
            class="my-editor"
            :language="progLang"
            line-numbers
            :tab-size="tabSize"
            :insert-spaces="insertSpaces"
            :highlight="highlighter"
            @input="onInput"
          />
        </div>
        <MultipaneResizer />
        <div
          ref="consoleOutput"
          class="console-output"
        >
          <ConsoleButtons
            :run-callback="runCode"
            :reset-callback="runReset"
            :save-callback="saveCallback"
            :load-callback="loadCallback"
            :upgrade-callback="upgradeCallback"
            class="console-buttons"
          />
          <div class="output">
            <canvas
              v-if="canvasEnabled"
              id="canvas"
              ref="canvas"
              height="1000"
              width="1000"
            />
            <div class="log">
              <p
                v-for="(line, i) of output"
                :key="i"
                :class="{error: err}"
                class="pre"
              >{{ line }}</p>
            </div>
          </div>
        </div>
      </Multipane>
    </div>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-haskell.js'; // required for purescript
import 'prismjs/components/prism-purescript.js';
import 'prismjs/components/prism-python.js';

// should match any other prism components that share a page
import 'prismjs/themes/prism-coy.css';

import { getWorker, useWorker, terminateWorker } from '@/lib/runWorker.js';
import { 
  compileGo,
  compilePureScript
} from '@/lib/cloudClient.js';

import { 
  sleep
} from '@/lib/sleep.js';

import LoadingOverlay from '@/components/LoadingOverlay.vue';
import ConsoleButtons from '@/components/ConsoleButtons.vue';
import Multipane from '@/components/Multipane.vue';
import MultipaneResizer from '@/components/MultipaneResizer.vue';

export default {
  components: {
    PrismEditor,
    LoadingOverlay,
    ConsoleButtons,
    Multipane,
    MultipaneResizer
  },
  props: {
    canvasEnabled: {
      type: Boolean,
      required: false,
      default: false
    },
    runCallback: {
      type: Function,
      required: false,
      default: ()=>{}
    },
    resetCallback: {
      type: Function,
      required: true
    },
    saveCallback: {
      type: Function,
      required: false,
      default: null
    },
    loadCallback: {
      type: Function,
      required: false,
      default: null
    },
    upgradeCallback: {
      type: Function,
      required: false,
      default: null
    },
    progLang: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      code: this.value,
      output: [],
      err: false,
      isLoading: false,
      worker: null
    };
  },
  computed: {
    tabSize(){
      if (this.progLang === 'go'){
        return 1; // because its a tab
      }
      if (this.progLang === 'py'){
        return 4;
      }
      return 2;
    },
    insertSpaces(){
      return this.progLang === 'js' || 
        this.progLang === 'purs' ||
        this.progLang === 'py';
    }
  },
  watch: {
    canvasEnabled(isEnabled) {
      this.$nextTick(() => {
        this.worker = getWorker(this.getWorkerLang(this.progLang), isEnabled ? this.$refs.canvas : null);
      });
    },
    progLang(newLang) {
      terminateWorker(this.worker);
      this.worker = getWorker(this.getWorkerLang(newLang));
    },
    value(newValue) {
      this.code = newValue;
    }
  },
  mounted(){
    this.worker = getWorker(this.getWorkerLang(this.progLang), this.canvasEnabled ? this.$refs.canvas : null);
  },
  methods: {
    onInput() {
      // this.currentValue is a string because HTML is weird
      this.$emit('input', this.code);
    },
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
    cancelCode(){
      this.isLoading = false;
      terminateWorker(this.worker);
      this.worker = getWorker(this.getWorkerLang(this.progLang));
      this.output.push('code execution cancelled');
      this.err = true;
    },
    async runCode() {
      try {
        this.output = [];
        this.isLoading = true;
        let hash = null;
        try {
          if (this.progLang === 'go'){
            const wasm = await compileGo(this.code);
            await useWorker(this.worker, wasm, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          }  else if (this.progLang === 'purs'){
            const resp = await compilePureScript(this.code);
            await useWorker(this.worker, resp.Code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } else if (this.progLang === 'js'){
          // make it feel like something is running
            await sleep(250);
            let final = await useWorker(this.worker, this.code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
            hash = final.hash;
          } else if (this.progLang === 'py'){
            await sleep(250);
            await useWorker(this.worker, this.code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          }
        } catch (err){
          await this.runCallback({output: JSON.stringify(err)});
          throw err;
        }
        this.err = false;
        this.isLoading = false;
        let finalOut = this.outputToSubmission(this.output);
        await this.runCallback({output: finalOut, hash});
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
    outputToSubmission(output){
      let finalOut = '';
      for (const line of output){
        if (Array.isArray(line) || typeof line === 'object'){
          finalOut += JSON.stringify(line);
        } else{
          finalOut += line;
        }
      }
      return finalOut;
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
  font-size: 14px;
  line-height: 1.5;

  .prism-editor__textarea:focus {
    outline: none;
  }
}

.code-editor-root {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  height: 100%;

  .editor-container {
    height: 65%;
    overflow: auto;
    margin: 10px 0 0 0;
  }

  .console-output {
    font-size: 14px;
    background-color: $gray-lighter;
    flex: 1;
    display: flex;
    flex-direction: row;
    padding: 10px;
    overflow: auto;
    border-top: solid 1px $gray-dark;

    .console-buttons {
      position: sticky;
      top: 0;
      align-self: flex-start;
    }


    .output {
      padding: 0 0 0 1em;
      width: 100%;
      display: flex;
      flex-direction: row;

      .log{
        .pre {
          white-space: pre-wrap;
        }
      }

      #canvas {
        border: 1px solid $gray-dark;
        background-color: $white;
        width: 50%;
        margin-right: 1em;
      }
    }

    p {
      margin: 0;
      font-size: 1em;
      color: $gray-darker;
    }

    .error {
      color: $pink-dark;
    }
  }
}

</style>
