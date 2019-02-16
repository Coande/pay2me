<template>
  <div class="page">
    <div class="page-header">
      <i v-for="(val,key) in showdataMap" :key="key" :class="['iconfont', `icon-${key}`]"></i>
    </div>
    <div class="page-content">
      <img :src="imgSrc">
    </div>
    <div class="page-footer">{{tips}}</div>
    <img v-if="coverImgSrc" class="cover-image" :src="coverImgSrc">
  </div>
</template>

<script>
import qrcode from "qrcode";
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      imgSrc: "",
      coverImgSrc: "",
      tips: "扫一扫向我付款",
      dataMap: {
        alipay: {
          name: "支付宝",
          result: ""
        },
        wechat: {
          name: "微信",
          result: ""
        },
        qq: {
          name: "QQ",
          result: ""
        }
      },
      current: ""
    };
  },
  computed: {
    showdataMap() {
      const keys = Object.keys(this.dataMap).filter(key => {
        return (
          (this.dataMap[key].result && !this.current) || this.current === key
        );
      });
      let result = {};
      Object.keys(this.dataMap).forEach(key => {
        if (keys.indexOf(key) !== -1) {
          result[key] = this.dataMap[key];
        }
      });
      return result;
    }
  },
  async mounted() {
    Object.keys(this.dataMap).forEach(key => {
      this.dataMap[key].result = decodeURIComponent(
        this.$utils.getQueryVariable(key)
      );
    });
    if (!this.$utils.getQueryVariable("production")) {
      this.current = "";
      this.imgSrc = await qrcode.toDataURL(
        `${window.location.href}&production=1`
      );
      html2canvas(document.body).then(canvas => {
        this.coverImgSrc = canvas.toDataURL();
        alert("你可以通过长按来保存当前图片");
      });
      return;
    }
    if (navigator.userAgent.match(/Alipay/i)) {
      // 支付宝
      if (this.dataMap.alipay.result) {
        this.imgSrc = await qrcode.toDataURL(this.dataMap.alipay.result);
        window.location.href = this.dataMap.alipay.result;
        this.current = "alipay";
      } else {
        alert("不支持支付宝付款");
      }
    } else if (navigator.userAgent.match(/MicroMessenger\//i)) {
      // 微信
      if (this.dataMap.wechat.result) {
        this.imgSrc = await qrcode.toDataURL(this.dataMap.wechat.result);
        this.tips = "长按识别二维码";
        this.current = "wechat";
      } else {
        alert("不支持微信付款");
      }
    } else if (navigator.userAgent.match(/QQ\//i)) {
      // QQ
      if (this.dataMap.qq.result) {
        this.imgSrc = await qrcode.toDataURL(this.dataMap.qq.result);
        this.tips = "长按识别二维码";
        this.current = "qq";
      } else {
        alert("不支持QQ付款");
      }
    } else {
      // 其它
      this.imgSrc = await qrcode.toDataURL(window.location.href);
      this.tips = "扫一扫向我付款";
      this.current = "";
      // 如果有支付宝二维码，自动调起支付宝支付
      const aObj = document.createElement("a");
      aObj.href = `alipays://platformapi/startapp?saId=10000007&qrcode=${encodeURIComponent(
        this.dataMap.alipay.result
      )}`;
      aObj.click();
    }
  }
};
</script>


<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.page-header {
  background: #eeeeee;
  flex: 0 0 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-header i {
  font-size: 4rem;
  color: #4caf50;
  margin-right: 10%;
}

.page-header i:last-of-type {
  margin-right: 0;
}

.page-content {
  width: 100%;
  background-color: #4caf50;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-content img {
  width: 60%;
}

.page-footer {
  flex: 0 0 20%;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
