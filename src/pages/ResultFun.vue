<template>
  <div class="page">
    <img class="result-image" :src="resultImageSrc">
  </div>
</template>

<script>
import qrcode from "qrcode";
import funImage from '../assets/fun.jpg';

export default {
  data() {
    return {
      qrcodePosition: {
        left: 240,
        top: 460,
        width: 200,
        height: 200
      },
      resultImageSrc: ""
    };
  },
  computed: {

  },
  mounted() {
    const canvas = document.createElement('canvas');
    const bgImg = new Image();
    bgImg.src = funImage;
    bgImg.onload = async () => {
      // 画背景
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;
      await this.$nextTick();
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bgImg, 0, 0);

      // 画二维码
      const urlObj = new URL(location.href);
      urlObj.searchParams.set('resultType', 'resultNormal');
      urlObj.searchParams.set('production', '1');
      const dataURL = await qrcode.toDataURL(
        urlObj.href
      );
      const qrcodeImg = new Image();
      qrcodeImg.src = dataURL;
      qrcodeImg.onload = () => {
        ctx.drawImage(qrcodeImg, this.qrcodePosition.left, this.qrcodePosition.top,
          this.qrcodePosition.width, this.qrcodePosition.height);

        this.resultImageSrc = canvas.toDataURL();

        if (this.getIsMobile()) {
          alert("你可以通过长按来保存当前图片");
        } else {
          alert("你可以右键另存当前图片");
        }
      };
    };
  },
  methods: {
    getIsMobile() {
      // code from: https://www.cnblogs.com/laq627/p/5848680.html
      const sUserAgent = navigator.userAgent.toLowerCase();
      const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      const bIsMidp = sUserAgent.match(/midp/i) == "midp";
      const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      const bIsAndroid = sUserAgent.match(/android/i) == "android";
      const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
          return true;
      }
      return false;
    }
  }
};
</script>


<style scoped>
.page {
  position: relative;
  height: 100%;
  max-height: 680px;
  display: flex;
  flex-direction: column;
}

.result-image {
  width: 100%;
}
</style>
