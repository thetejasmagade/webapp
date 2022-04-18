<template>
  <div class="h-full flex flex-col justify-end">
    <TopNav :title="`${displayLang.name} Playground`" />

    <div
      class="z-10 right-28 top-14 flex justify-center flex-row m-4 md:block md:absolute"
    >
      <SelectDropdown
        :options="displayLangsArray"
        :default="displayLangs[lang]"
        class="max-w-full md:w-auto"
        @update:modelValue="
          $router.push({ path: `/playground/${displayToKey($event)}` })
        "
      />
    </div>

    <CodeEditor
      v-model="code"
      class="flex-1 bg-gray-200 m-full overflow-auto"
      :run-callback="() => {}"
      :reset-callback="setCode"
      :prog-lang="progLang"
      :canvas-enabled="lang === 'jsCanvas'"
      :is-cheat-purchased="true"
    />
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor.vue";
import TopNav from "@/components/navs/TopNav.vue";
import SelectDropdown from "@/components/SelectDropdown.vue";

import { reactive, computed, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";

function getCode(lang) {
  if (lang === "go") {
    return `package main

import "fmt"

func main(){
\tfmt.Println("hello, world")
}

// code is compiled to WASM
// on Boot.dev's servers then
// executes on your machine
// read about it on my blog:
// https://blog.boot.dev/golang/running-go-in-the-browser-with-web-assembly-wasm`;
  }

  if (lang === "js") {
    return `
console.log("hello, world")
`;
  }
  if (lang === "jsCanvas") {
    return `ctx.fillStyle = 'rgb(200, 0, 0)';
ctx.fillRect(100, 100, 500, 500);

ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
ctx.fillRect(300, 300, 500, 500);

console.log("hello, world")

// 'ctx' is predefined by Boot.dev as a 2d context for drawing
// The canvas will always be 1000x1000 pixels
// for the purpose of drawing. You can
// resize your screen and the canvas will grow/shrink
// and stretch the image, it won't change your logic.
`;
  }
  if (lang === "py") {
    return `print("hello, world")

# We use a Python interpreter that's compiled to Web Assembly
# to run code right in your browser using a Web Worker
# read about it on my blog: 
# https://blog.boot.dev/python/running-python-in-the-browser-with-web-assembly
        `;
  }
  if (lang === "purs") {
    return `module Main where

import Prelude

import Effect.Console (logShow)

main = do
  logShow "hello, world"
`;
  }
  return "unknown language";
}

export default {
  components: {
    SelectDropdown,
    TopNav,
    CodeEditor,
  },
  setup() {
    const route = useRoute();

    const state = reactive({
      code: "",
      lang: route.params.lang,
      displayLangs: {
        go: {
          name: "Golang",
          color: null,
        },
        js: {
          name: "JavaScript",
          color: null,
        },
        jsCanvas: {
          name: "JavaScript Canvas",
          color: null,
        },
        py: {
          name: "Python",
          color: null,
        },
        purs: {
          name: "PureScript",
          color: null,
        },
      },
      displayLang: {},
      displayLangsArray: [],
      progLang: "",
    });
    const computedMeta = computed(() => {
      return getComputedMeta({
        title: `${state.displayLang?.name} Playground`,
        description: `Run ${state.displayLang?.name} code in the browser. Execute your scripts in a sandboxed playground. Take courses to learn to write code and earn achievements to show off your skills.`,
        image:
          "https://qvault.io/wp-content/uploads/2021/04/qvault-coding-playground.jpg",
      });
    });
    useMeta(computedMeta);

    state.displayLang = computed(() => {
      return state.displayLangs[state.lang];
    });
    state.displayLangsArray = computed(() => {
      return Object.values(state.displayLangs);
    });
    state.progLang = computed(() => {
      if (state.lang === "jsCanvas") {
        return "js";
      }
      return state.lang;
    });

    onMounted(() => {
      state.code = getCode(state.lang);
    });

    onBeforeRouteUpdate((to, from, next) => {
      state.lang = to.params.lang;
      state.code = getCode(state.lang);
      next();
    });

    state.setCode = () => {
      state.code = getCode(state.lang);
    };
    state.displayToKey = (displayName) => {
      return Object.keys(state.displayLangs).find(
        (key) => state.displayLangs[key] === displayName
      );
    };

    return state;
  },
};
</script>

<style scoped></style>
