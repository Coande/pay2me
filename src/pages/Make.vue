<template>
  <div class="page">
    <div class="page-header">制作多合一收款码</div>
    <div class="page-content">
      <div v-for="(val,key) in dataMap" :key="key">
        <label
          class="picker-button"
          :class="[val.result ? 'is-active': '']"
          :for="`${key}File`"
        >选择{{val.name}}收款码</label>
        <input
          class="hidden-input"
          :ref="key"
          :id="`${key}File`"
          type="file"
          @change="handleChange(arguments[0], key)"
          accept="image/*"
        >
      </div>
      <div>
        <button class="submit-button" @click="handleSubmit">合成</button>
      </div>
    </div>
    <div class="copyright">&copy;&nbsp;2019&nbsp;Coande</div>
  </div>
</template>

<script>
import jsQR from "jsqr";

export default {
  name: "app",
  components: {},
  data() {
    return {
      CANVASMAXWIDTH: 400,
      CANVASMAXHEIGHT: 600,
      dataMap: {
        alipay: {
          name: "支付宝",
          result: "",
          startsWith: "https://qr.alipay.com/"
        },
        wechat: {
          name: "微信",
          result: "",
          startsWith: "wxp://"
        },
        qq: {
          name: "QQ",
          result: "",
          startsWith:
            "https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&u="
        }
      }
    };
  },
  methods: {
    handleChange(event, key) {
      const file = event.target.files[0];
      // 没有选择文件不处理
      if (!file) {
        return;
      }
      // 图片压缩一下识别率更高，特别是手机拍的照片分辨率高导致识别失败率较高
      const img = new Image();
      img.src = URL.createObjectURL(file);
      let imgWidth, imgHeight, targetWidth, targetHeight;
      img.onload = () => {
        imgWidth = img.width;
        imgHeight = img.height;
        if (
          imgWidth > this.CANVASMAXWIDTH ||
          imgHeight > this.CANVASMAXHEIGHT
        ) {
          if (
            imgWidth / imgHeight >
            this.CANVASMAXWIDTH / this.CANVASMAXHEIGHT
          ) {
            targetWidth = this.CANVASMAXWIDTH;
            targetHeight = (targetWidth / imgWidth) * imgHeight;
          } else {
            targetHeight = this.CANVASMAXHEIGHT;
            targetWidth = (targetHeight / imgHeight) * imgWidth;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        let resultObj = {};
        try {
          resultObj = jsQR(
            imageData.data,
            Math.floor(targetWidth),
            Math.floor(targetHeight)
          );
        } catch (error) {
          alert("无法识别二维码");
          return;
        }
        if (resultObj && resultObj.data) {
          if (!resultObj.data.startsWith(this.dataMap[key].startsWith)) {
            alert(`不是${this.dataMap[key].name}收款码`);
          } else {
            this.dataMap[key].result = resultObj.data;
          }
        } else {
          alert("找不到二维码");
        }
      };
    },
    handleSubmit() {
      const alipayResult = this.dataMap.alipay.result;
      const wechatResult = this.dataMap.wechat.result;
      const qqResult = this.dataMap.qq.result;
      const resultList = [];
      if (alipayResult) {
        resultList.push(`alipay=${encodeURIComponent(alipayResult)}`);
      }
      if (wechatResult) {
        resultList.push(`wechat=${encodeURIComponent(wechatResult)}`);
      }
      if (qqResult) {
        resultList.push(`qq=${encodeURIComponent(qqResult)}`);
      }
      if (resultList.length) {
        // 有部分app或网站可能会自动加个来源参数
        const tempString = window.location.href.indexOf("?") === -1 ? "?" : "&";
        window.location.href = `${
          window.location.href
        }${tempString}${resultList.join("&")}`;
      } else {
        alert("请先选择二维码");
      }
    }
  }
};
</script>

<style scoped>
.page {
  height: 100%;
  position: relative;
}
.page-header {
  height: 20vh;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-content {
  width: 80%;
  margin: 0 auto;
}
.picker-button {
  display: inline-block;
  width: 100%;
  padding: 10px;
  border: 1px solid #aaa;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.picker-button.is-active {
  background-color: #4caf50;
  border-color: #4caf50;
  color: #ffffff;
}

.submit-button {
  border: 1px solid #4caf50;
  background-color: #4caf50;
  color: #ffffff;
  outline: none;
  padding: 10px;
  width: 100%;
  margin-top: 2rem;
  cursor: pointer;
  font-size: 1rem;
}

.hidden-input {
  display: none;
}
.copyright {
  color: #cecece;
  position: absolute;
  bottom: 1rem;
  width: 100%;
  text-align: center;
}
</style>


