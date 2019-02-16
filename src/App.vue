<template>
  <div id="app">
    <make-page v-if="showMake"></make-page>
    <result-page v-if="!showMake"></result-page>
  </div>
</template>

<script>
import MakePage from '@/pages/Make';
import ResultPage from '@/pages/Result';
export default {
  components: {
    MakePage,
    ResultPage
  },
  data() {
    return {
      showMake: true
    };
  },
  methods: {
  },
  mounted() {
    const alipayUrl = decodeURIComponent(this.$utils.getQueryVariable('alipay'));
    const wechatUrl = decodeURIComponent(this.$utils.getQueryVariable('wechat'));
    const qqUrl = decodeURIComponent(this.$utils.getQueryVariable('qq'));
    if (alipayUrl || wechatUrl || qqUrl) {
      this.showMake = false;
    } else {
      this.showMake = true;
    }
  }
}
</script>


<style scoped>
#app {
  max-width: 400px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  height: 100%;
}
#app >>> * {
  box-sizing: border-box;
  user-select: none;
}
</style>

<style>
html,body {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>
