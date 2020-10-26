<template>
  <div id="container">
    <TopNav :title="`${displayLang} Playground`" />

    <div class="select-container">
      <SelectDropdown
        :options="displayLangsArray"
        :default="displayLangs[lang]"
        class="select"
        @input="$router.push({path: `/playground/${displayToKey($event)}` })"
      />
    </div>

    <CodeEditor
      id="editor"
      ref="codeEditor"
      :run-callback="() => {}"
      :reset-callback="setCode"
      :prog-lang="lang"
    />
  </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor';
import TopNav from '@/components/TopNav';
import SelectDropdown from '@/components/SelectDropdown';

export default {
  metaInfo() {
    const description = `Run ${this.displayLang} code in the browser. Execute your scripts in a sandboxed playground. Take courses to learn to write code and earn achievements to show off your skills.`;
    const featuredImage = 'https://qvault.io/wp-content/uploads/2020/09/Site-Social-Image-3.png';
    const title = `Qvault Playground - ${this.displayLang}`;
    return {
      title: 'Qvault - Playground',
      meta: [
        { vmid:'description', name: 'description', content: description },

        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'og:description', property: 'og:description', content: description },
        { vmid:'og:image', property: 'og:image', content: featuredImage },

        { vmid:'twitter:title', name: 'twitter:title', content: title },
        { vmid:'twitter:description', property: 'twitter:description', content: description },
        { vmid:'twitter:image', name: 'twitter:image', content: featuredImage }
      ]
    };
  },
  components: {
    SelectDropdown,
    TopNav,
    CodeEditor
  },
  data(){
    return {
      lang: this.$route.params.lang,
      displayLangs: {
        go: 'Go - Web Assembly',
        js: 'JavaScript',
        python: 'Python - Web Assembly',
        rust: 'Rust - Web Assembly',
        purescript: 'PureScript'
      }
    };
  },
  computed: {
    displayLang(){
      return this.displayLangs[this.lang];
    },
    displayLangsArray(){
      return Object.values(this.displayLangs);
    }
  },
  mounted(){
    this.setCode();
  },
  beforeRouteUpdate (to, from, next) {
    this.lang = to.params.lang;
    this.setCode();
    next();
  },
  methods:{
    displayToKey(displayName){
      return Object.keys(this.displayLangs).find(key => this.displayLangs[key] === displayName);
    },
    setCode(){
      if (this.lang === 'go'){
        this.$refs.codeEditor.setCode(`package main

import "fmt"

func main(){
\tfmt.Println("hello, world")
}

// code is compiled to WASM
// on our servers then
// executes on your machine
// read about it on our blog:
// https://qvault.io/2020/07/01/running-go-in-the-browser-with-web-assembly-wasm/`
        );
        return;
      }
      if (this.lang === 'js'){
        this.$refs.codeEditor.setCode(`
console.log("hello, world")
`);
        return;
      }
      if (this.lang === 'python'){
        this.$refs.codeEditor.setCode(`print("hello, world")

# We use a Python interpreter that's compiled to Web Assembly
# to run code right in your browser using a Web Worker
# read about it on our blog: 
# https://qvault.io/2020/09/24/running-python-in-the-browser-with-web-assembly/
        `);
        return;
      }
      if (this.lang === 'rust'){
        this.$refs.codeEditor.setCode(`fn main() {
  println!("hello, world");
}
`);
        return;
      }
      if (this.lang === 'purescript'){
        this.$refs.codeEditor.setCode(`module Main where

import Prelude

import Effect.Console (logShow)

main = do
  logShow "hello, world"
`);
        return;
      }
      this.$refs.codeEditor.setCode('unknown language');
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

#container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: $white;
  height: 100%;

  .langs{
    display: flex;
    flex-direction: row;
    padding: 1em;
    
    a {
      padding-left: 10px;
    }
  }

  #editor {
    flex: 1;
    background-color: $white;
    max-height: 100%;
    overflow: auto;
  }

  .select-container{
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    margin: 1em;

    @media screen and (max-width: $mobile-size) {
      justify-content: center;
    }
  }

  .select {
    max-width: 300px;

    @media screen and (max-width: $mobile-size) {
      max-width: 100%;
    }
  }
}
</style>
