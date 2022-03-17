<template>
  <div>
    <LoadingOverlay
      :is-loading="isLoading"
      :cancel="cancelCode"
      :display-text="loadingText"
    />

    <ConfirmModal
      ref="resetCodeModal"
      heading="Want to reset your code to the starting point for this exercise?"
      text="
      This will overwrite the code you have in your editor currently.
      "
      :on-confirm="runReset"
    />
    <div class="font-mono h-full">
      <Multipane layout="vertical">
        <div class="w-full h-4/6">
          <CodeMirrorWrapper
            v-if="!isCheating"
            :model-value="modelValue"
            class="h-full"
            :options="codeMirrorOptions"
            @update:modelValue="(value) => $emit('update:modelValue', value)"
          />
          <CodeMirrorMergeWrapper
            v-else
            class="h-full"
            :model-value="modelValue"
            :solution="solution"
            :options="codeMirrorOptions"
            @update:modelValue="(value) => $emit('update:modelValue', value)"
          />
        </div>
        <MultipaneResizer layout="vertical" />
        <div
          class="w-full p-2 flex-0 bg-gray-800 border-t-2 border-b border-gray-600"
        >
          <ConsoleButtons
            :run-callback="isCheating ? null : runCode"
            :reset-callback="() => $refs.resetCodeModal.show()"
            :cheat-callback="cheatCallback"
            :is-cheating="isCheating"
            :is-cheat-purchased="isCheatPurchased"
            :cheat-cost="cheatCost"
          />
        </div>
        <div
          ref="console"
          class="text-md flex-1 flex-row overflow-auto w-full bg-gray-800 text-gray-200 py-4 pl-4"
        >
          <Multipane layout="horizontal" class="h-full flex flex-row">
            <canvas
              v-if="canvasAllowed"
              id="canvas"
              ref="canvas"
              :key="numCancellations"
              height="1000"
              width="1000"
              class="bg-white mr-4"
            />
            <MultipaneResizer layout="horizontal" />
            <div class="overflow-auto h-full flex-1 pr-4">
              <p
                v-for="(line, i) of output"
                :key="i"
                :class="{ 'text-red-400': err }"
                class="whitespace-pre-wrap m-0"
              >
                {{ line }}
              </p>
            </div>
          </Multipane>
        </div>
      </Multipane>
    </div>
  </div>
</template>

<script>
import {
  getWorker,
  useWorker,
  terminateWorker,
  awaitWorkerReady,
} from "@/lib/runWorker.js";
import { compileGo, compilePureScript } from "@/lib/cloudClient.js";

import { sleep } from "@/lib/sleep.js";

import ConfirmModal from "@/components/ConfirmModal.vue";
import CodeMirrorWrapper from "@/components/CodeMirrorWrapper.vue";
import CodeMirrorMergeWrapper from "@/components/CodeMirrorMergeWrapper.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import ConsoleButtons from "@/components/ConsoleButtons.vue";
import Multipane from "@/components/Multipane.vue";
import MultipaneResizer from "@/components/MultipaneResizer.vue";

import { notify } from "@/lib/notification.js";

export default {
  components: {
    LoadingOverlay,
    ConsoleButtons,
    Multipane,
    MultipaneResizer,
    CodeMirrorWrapper,
    CodeMirrorMergeWrapper,
    ConfirmModal,
  },
  props: {
    canvasEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    runCallback: {
      type: Function,
      required: false,
      default: () => {},
    },
    resetCallback: {
      type: Function,
      required: true,
    },
    cheatCallback: {
      type: Function,
      required: false,
      default: null,
    },
    isCheating: {
      type: Boolean,
      required: false,
      default: false,
    },
    progLang: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: false,
      default: null,
    },
    isCheatPurchased: {
      type: Boolean,
      required: false,
      default: null,
    },
    cheatCost: {
      type: Number,
      required: false,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      output: [],
      err: false,
      isLoading: false,
      worker: null,
      canvasAllowed: this.canvasEnabled,
      // re-render the canvas each time we
      // need a new worker
      numCancellations: 0,
      loadingText: null,
    };
  },
  computed: {
    codeMirrorOptions() {
      return {
        indentWithTabs: this.indentWithTabs,
        tabSize: this.tabSize,
        indentUnit: this.tabSize,
        mode: this.codeMirrorLang,
        theme: "darcula",
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        styleActiveLine: true,
        revertButtons: false,
        collapseIdentical: false,
        connect: "align",
        // this means tab key does an "indent" rather
        // than blindly inserting tabs
        extraKeys: { Tab: "indentMore" },
      };
    },
    indentWithTabs() {
      if (this.progLang === "go") {
        return true;
      }
      return false;
    },
    codeMirrorLang() {
      if (this.progLang === "go") {
        return "go";
      }
      if (this.progLang === "py") {
        return "python";
      }
      if (this.progLang === "js") {
        return "javascript";
      }
      if (this.progLang === "purs") {
        return "haskell";
      }
      return "unknown";
    },
    tabSize() {
      if (this.progLang === "go" || this.progLang === "py") {
        return 4;
      }
      return 2;
    },
  },
  watch: {
    canvasEnabled(isEnabled) {
      this.canvasAllowed = isEnabled;
      this.$nextTick(() => {
        try {
          this.worker = getWorker(
            this.getWorkerLang(this.progLang),
            isEnabled ? this.$refs.canvas : null
          );
        } catch (err) {
          this.canvasAllowed = false;
          notify({
            type: "danger",
            text: err,
          });
        }
      });
    },
    progLang(newLang) {
      this.refreshWorker(newLang);
    },
    modelValue(newModelValue) {
      this.$emit("update:modelValue", newModelValue);
    },
  },
  mounted() {
    try {
      this.worker = getWorker(
        this.getWorkerLang(this.progLang),
        this.canvasEnabled ? this.$refs.canvas : null
      );
    } catch (err) {
      this.canvasAllowed = false;
      notify({
        type: "danger",
        text: err,
      });
    }
  },
  methods: {
    refreshWorker(lang) {
      terminateWorker(this.worker);
      this.numCancellations++;
      this.$nextTick(() => {
        this.worker = getWorker(
          this.getWorkerLang(lang),
          this.canvasEnabled ? this.$refs.canvas : null
        );
      });
    },
    getWorkerLang(progLang) {
      if (progLang === "purs") {
        return "js";
      }
      return progLang;
    },
    scrollToEnd() {
      requestAnimationFrame(() => {
        var content = this.$refs.console;
        content.scrollTop = Number.MAX_SAFE_INTEGER;
      });
    },
    cancelCode() {
      this.isLoading = false;
      this.refreshWorker(this.progLang);
      this.output.push("code execution cancelled");
      this.err = true;
    },
    async runCode() {
      try {
        this.output = [];
        let hash = null;
        // we need to get a new worker each time because
        // we need to transfer a new canvas because the last animation
        // is still running
        if (this.canvasAllowed) {
          this.refreshWorker(this.progLang);
        }

        if (!this.canvasAllowed && this.canvasEnabled) {
          notify({
            type: "danger",
            text: "Your browser doesn't support canvas exercises, please use Chrome, Edge or Opera",
          });
          return;
        }

        this.isLoading = true;

        try {
          if (this.progLang === "go") {
            this.loadingText = "Compiling your code...";
            const wasm = await compileGo(this.modelValue);
            this.loadingText = "Setting up your environment...";
            await awaitWorkerReady(this.worker);
            this.loadingText = "Running your code...";
            // make it feel like something is running
            await sleep(250);
            await useWorker(this.worker, wasm, (data) => {
              this.output.push(data);
              this.scrollToEnd();
            });
          } else if (this.progLang === "purs") {
            this.loadingText = "Transpiling your code...";
            const resp = await compilePureScript(this.modelValue);
            this.loadingText = "Setting up your environment...";
            await awaitWorkerReady(this.worker);
            this.loadingText = "Running your code...";
            // make it feel like something is running
            await sleep(250);
            await useWorker(this.worker, resp.Code, (data) => {
              this.output.push(data);
              this.scrollToEnd();
            });
          } else if (this.progLang === "js") {
            this.loadingText = "Running your code...";
            // make it feel like something is running
            await sleep(250);
            let final = await useWorker(
              this.worker,
              this.modelValue,
              (data) => {
                this.output.push(data);
                this.scrollToEnd();
              }
            );
            hash = final.hash;
          } else if (this.progLang === "py") {
            this.loadingText = "Setting up your environment...";
            await awaitWorkerReady(this.worker);
            this.loadingText = "Running your code...";
            // make it feel like something is running
            await sleep(250);
            await useWorker(this.worker, this.modelValue, (data) => {
              this.output.push(data);
              this.scrollToEnd();
            });
          }
        } catch (err) {
          await this.runCallback({ output: JSON.stringify(err) });
          throw err;
        }
        this.err = false;
        this.isLoading = false;
        this.loadingText = null;
        let finalOut = this.outputToSubmission(this.output);
        await this.runCallback({ output: finalOut, hash });
      } catch (err) {
        this.isLoading = false;
        let errString = err;
        if (typeof err !== "string") {
          errString = err.toString();
        }
        const errLines = errString.split(/\r?\n/);
        this.output = errLines;
        this.err = true;
      }
    },
    outputToSubmission(output) {
      let finalOut = "";
      for (const line of output) {
        if (Array.isArray(line) || typeof line === "object") {
          finalOut += JSON.stringify(line);
        } else {
          finalOut += line;
        }
      }
      return finalOut;
    },
    async runReset() {
      try {
        await this.resetCallback(this.output.join(""));
      } catch (err) {
        this.output = null;
        this.err = false;
      }
    },
  },
};
</script>

<style scoped></style>
