# 离线版问卷





## 💡前言

  某天在【掘金】看到低代码相关文章，结合自己开发过那么多的项目，系统集成 “表单”、“问卷”、”考试” 还是挺常见的，那么摆在面前的就三个选择：自研、找个开源、买现成服务。

- 自研
  - ✅优点：定制开发，深入融入系统，可随着系统迭代不断升级
  - ❌缺点：时间成本高、人力成本高、只能跟着一个项目，另外项目要用需要复制一份，遇到bug，复制了多少份就得改多少次
- 找个开源
  - ✅优点：开箱即用、省事省力
  - ❌缺点：需要阅读理解源码、前端框架需要与项目框架一致
- 买现场服务
  - ✅优点：除了花钱，全是优点
  - ❌缺点：订阅花钱，项目成本增加



  所以突发奇想，能不能弄一款【离线版问卷】，项目独立部署，只处理 “编辑” 和 “渲染”，任意项目想要集成，通过【iframe】嵌入，只关心数据。

- 离线版问卷
  - ✅优点：项目独立部署、单独维护、多项目可以无视前端框架进行集成，只关心数据
  - ❌缺点：只适合要求不高的场景



## 🎨 预览

![设计页面](https://ice.frostsky.com/2024/09/07/9333849b177c02567493135777dcbb1c.png)



## 🌈 技术栈

```
vue3
```



## 📦 仓库

[questionnaire_web](https://github.com/chenbz777/questionnaire_web)



## 💻 初始化

```bash
pnpm install
```



## 🚀 启动

```bash
pnpm dev
```



## 🛠️ 打包

```bash
pnpm build
```



## 🗂 目录结构

```
.
├── README.md
├── index.html
├── package.json
├── public
├── src
│   ├── App.vue
│   ├── api
│   ├── assets
│   ├── components
│   ├── hooks
│   │   ├── useAnimate  // 动画
│   │   ├── useDesignV1  // 问卷设计V1
│   │   │   ├── action.js  // 解析动作函数
│   │   │   ├── common  // 常用函数
│   │   │   ├── index.js
│   │   │   ├── materielComponents  // 控件源码
│   │   │   └── materielModel  // 控件模型
│   │   └── useGlobal  // 全局
│   ├── main.js
│   ├── router  // 路由
│   ├── stores
│   ├── styles  // 全局样式
│   ├── utils  // 工具集合
│   └── views
│       ├── 404.vue
│       ├── home.vue
│       └── questionnaire
│           └── v1
│               ├── answer  // 填答页面
│               ├── demo.vue
│               ├── design  // 设计页面
│               └── styles  // 样式
└── vite.config.js
```





## ✨ 使用方法

### 集成【设计问卷】

```vue
<script setup>
// 第一步: 拼凑地址, 后续换成部署后的域名
const designUrl = 'https://chenbz777.github.io/questionnaire_web/#/questionnaire/v1/design';

// 第二步: 问卷数据, 实际上应该是通过接口获取
let questionnaireData = {};

// 第三步: 设置问卷数据
function setQuestionnaireData() {
  console.log('setQuestionnaireData', questionnaireData);
  // setQuestionnaireData 方法是“离线版问卷”挂载上去的
  window.myIframe.contentWindow.setQuestionnaireData(questionnaireData);
}
  
// 第四步: 配置完成后获取问卷数据存起来, 这里实际上应该是传递给接口进行保存
function getQuestionnaireData() {
  // getQuestionnaireData 方法是“离线版问卷”挂载上去的
  questionnaireData = window.myIframe.contentWindow.getQuestionnaireData();
  console.log('getQuestionnaireData', questionnaireData);
}
</script>

<template>
  <div>
    <iframe :src="designUrl" id="myIframe" class="my-iframe"></iframe>
  </div>
</template>

<style scoped>
.my-iframe {
  display: block;
  width: 100%;
  height: 100vh;
  border: 0;
}
</style>
```



### 集成【填写问卷】

```vue
<script setup>
import { onMounted, nextTick } from 'vue';

// 第一步: 拼凑地址, 后续换成部署后的域名
const answerUrl = 'https://chenbz777.github.io/questionnaire_web/questionnaire/v1/answer';

// 第二步: 问卷数据, 实际上应该是通过接口获取
let questionnaireData = {};

// 第三步: 设置问卷数据
function setQuestionnaireData() {
  console.log('setQuestionnaireData', questionnaireData);
  
  // data 是问卷填答数据,把onSubmit获取到的 submitData.data 原样传回去就可以进行数据回显
  const data = {};
  
  // setQuestionnaireData 方法是“离线版问卷”挂载上去的
  window.myIframe.contentWindow.setQuestionnaireData(questionnaireData, data);
}

nextTick(() => {
  // 第四步: 挂载提交方法进行回调
  window.myIframe2.contentWindow.onSubmit = function (submitData) {
    /**
     * submitData: {
     *  errorList: [],  // 错误列表
     *  data: {},  // 问卷数据
     *  totalScore: 0,  // 总分
     *  score: 0,  // 得分
     *  questionAnswer: [],  // 答题情况: 题目-得分、不得分、未答
     *  answerTimer: 0,  // 答题时长
     */
    console.log('onSubmit', submitData);
  };
});

onMounted(() => {
  // 设置问卷数据: 实际上应该是请求数据获取后再调用
  setQuestionnaireData();
});
</script>

<template>
  <div>
    <iframe :src="answerUrl" id="myIframe" class="my-iframe"></iframe>
  </div>
</template>

<style scoped>
.my-iframe {
  display: block;
  width: 100%;
  height: 100vh;
  border: 0;
}
</style>
```



### 集成【只读问卷】

```vue
<script setup>
import { onMounted } from 'vue';

// 第一步: 拼凑地址, 后续换成部署后的域名
const readonlyUrl = 'https://chenbz777.github.io/questionnaire_web/#/questionnaire/v1/readonly';

// 第二步: 问卷数据, 实际上应该是通过接口获取
let questionnaireData = {};

// 第三步: 设置问卷数据
function setQuestionnaireData() {
  console.log('setQuestionnaireData', questionnaireData);
  
  // data 是问卷填答数据,把onSubmit获取到的 submitData.data 原样传回去就可以进行数据回显
  const data = {};
  
  // setQuestionnaireData 方法是“离线版问卷”挂载上去的
  window.myIframe.contentWindow.setQuestionnaireData(questionnaireData, data);
}
  
onMounted(() => {
  // 设置问卷数据: 实际上应该是请求数据获取后再调用
  setQuestionnaireData();
});
</script>

<template>
  <div>
    <iframe :src="readonlyUrl" id="myIframe" class="my-iframe"></iframe>
  </div>
</template>

<style scoped>
.my-iframe {
  display: block;
  width: 100%;
  height: 100vh;
  border: 0;
}
</style>
```



### 集成【填答简洁版问卷】

```js
const answerEasyUrl = 'https://chenbz777.github.io/questionnaire_web/#/questionnaire/v1/answer/easy';
```

> 用法与【填答问卷】一致，只是去掉了"皮肤"样式



### 集成【只读简洁版问卷】

```js
const readonlyEasyUrl = 'https://chenbz777.github.io/questionnaire_web/#/questionnaire/v1/readonly/easy';
```

> 用法与【只读问卷】一致，只是去掉了"皮肤"样式



## 🏗️ 待完善

1. [控件] 附件上传

   > 因为没有存储库，所以没有接上传功能

2. [控件] 日期时间

   > 暂时还没找到好的日期时间插件，后续再补充



## 📌 许可协议

本项目基于 MIT 许可证开源，详情请参阅 [LICENSE](./LICENSE) 文件。



## 🎨 展示

题型

![题型](https://ice.frostsky.com/2024/09/07/76cbe06bece057e35164d96bcb42a153.png)

大纲

![大纲](https://ice.frostsky.com/2024/09/07/41c077dd8be1669ea701299e8e95647a.png)

逻辑

![逻辑](https://ice.frostsky.com/2024/09/07/1f0282d137bbc11da12edb5c6fb00221.png)

事件

![事件](https://ice.frostsky.com/2024/09/07/599d02223ff0ded5bb744d4464229e8c.png)

检查

![检查](https://ice.frostsky.com/2024/09/07/3c35bacbb4dd9bb5a1ee767967772a5c.png)

题库

![题库](https://ice.frostsky.com/2024/09/07/5c8536d3b58a3de3907df477da857833.png)

皮肤

![皮肤](https://ice.frostsky.com/2024/09/07/e01f7c3c24ae62ed63e7dbbce33e8a3c.png)

预览

![预览](https://ice.frostsky.com/2024/09/07/e37e78575c73ec34f34c1cde35dbc27b.png)
