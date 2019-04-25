<template>
  <div id="app">
    <make-page v-if="resultType === ''"></make-page>
    <result-page v-if="resultType === 'resultNormal'"></result-page>
    <result-page-fun v-if="resultType === 'resultFun'"></result-page-fun>
  </div>
</template>

<script>
import MakePage from "@/pages/Make";
import ResultPage from "@/pages/Result";
import ResultPageFun from "@/pages/ResultFun";
export default {
  components: {
    MakePage,
    ResultPage,
    ResultPageFun
  },
  data() {
    return {
      resultType: ''
    };
  },
  methods: {},
  mounted() {
    const resultType = decodeURIComponent(
      this.$utils.getQueryVariable("resultType")
    );
    this.resultType = resultType ? resultType : '';
  }
};
</script>


<style scoped>
#app {
  max-width: 400px;
  width: 100%;
  height: 100%;
  text-align: center;
  margin: 0 auto;
}
#app >>> * {
  box-sizing: border-box;
  user-select: none;
}
</style>

<style>
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>
