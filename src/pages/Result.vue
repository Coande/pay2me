<template>
  <div class="page">
    <div class="page-header">
      <i
        v-for="(val,key) in showDataList"
        :key="key"
        :class="['iconfont', `icon-${key}`]"
      ></i>
    </div>
    <div class="page-content">
      <img :src="imgSrc">
    </div>
    <div class="page-footer">{{tips}}</div>
  </div>
</template>

<script>
import qrcode from "qrcode";
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      imgSrc: "",
      tips: "扫一扫向我付款",
      dataList: {
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
    showDataList() {
      const keys = Object.keys(this.dataList).filter(key => {
        return (this.dataList[key].result && !this.current) || this.current === key
      });
      let result = {};
      Object.keys(this.dataList).forEach(key => {
        if (keys.indexOf(key) !== -1) {
          result[key] = this.dataList[key];
        }
      });
      return result;
    }
  },
  async mounted() {
    Object.keys(this.dataList).forEach(key => {
      this.dataList[key].result = decodeURIComponent(
        this.$utils.getQueryVariable(key)
      );
    });
    if (!this.$utils.getQueryVariable('production')) {
      this.current = '';
      this.imgSrc = await qrcode.toDataURL(`${window.location.href}&production=1`);
      html2canvas(document.body).then(function(canvas) {
        const pageDataURL = canvas.toDataURL();
        const pageImage = new Image();
        pageImage.src = pageDataURL;
        pageImage.style.position = 'absolute';
        pageImage.style.top = '0';
        pageImage.style.left = '0';
        pageImage.style.width = '100%';
        document.body.appendChild(pageImage);
        alert('你可以通过长按来保存当前图片');
      });
      return;
    }
    if (navigator.userAgent.match(/Alipay/i)) {
      // 支付宝
      if (this.dataList.alipay.result) {
        this.imgSrc = await qrcode.toDataURL(this.dataList.alipay.result);
        window.location.href = this.dataList.alipay.result;
        this.current = "alipay";
      } else {
        alert('不支持支付宝付款');
      }
    } else if (navigator.userAgent.match(/MicroMessenger\//i)) {
      // 微信
      if (this.dataList.wechat.result) {
        this.imgSrc = await qrcode.toDataURL(this.dataList.wechat.result);
        this.tips = "长按识别二维码";
        this.current = "wechat";
      } else {
        alert('不支持微信付款');
      }
    } else if (navigator.userAgent.match(/QQ\//i)) {
      // QQ
      if (this.dataList.qq.result) {
        this.imgSrc = await qrcode.toDataURL(this.dataList.qq.result);
        this.tips = "长按识别二维码";
        this.current = "qq";
      } else {
        alert('不支持QQ付款');
      }
    } else {
      // 其它
      this.imgSrc = await qrcode.toDataURL(window.location.href);
      this.tips = "扫一扫向我付款";
      this.current = "";
      // 如果有支付宝二维码，自动调起支付宝支付
      const aObj = document.createElement("a");
      aObj.href = `alipays://platformapi/startapp?saId=10000007&qrcode=${encodeURIComponent(
        this.dataList.alipay.result
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
</style>
