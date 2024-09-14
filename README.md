# 离线版问卷

## 💡 前言

某天在【掘金】看到低代码相关文章，结合自己开发过那么多的项目，系统集成 “表单”、“问卷”、”考试” 还是挺常见的，查阅了好多开源项目，都是独立的一个系统，很难集成到现有的项目中，于是我在想：为什么不能有一款【离线版问卷】，它提供 ”设计问卷页面“ ，也提供 “渲染问卷页面”，它只关心数据，不关心集成到哪个系统，不关心集成到哪个功能。

#### 亮点

1. 提供 “设计问卷” 页面
2. 提供 “填写问卷” 页面
3. 提供 “只读问卷” 页面
4. 提供 “简洁填写问卷” 页面
5. 提供 “简洁只读问卷” 页面
6. 数据安全，点击【提交】按钮后，提交回调函数由“宿主系统”提供

#### 场景

- 想开发一款【问卷系统】，不用从 0 开始去构建：控件模型、事件交互、逻辑解析、问卷渲染，拿来即用。
- 想开发一款【活动系统】，每个活动需要填写的 “报名信息” 不一样，引入【离线版问卷】，可进行动态配置填写字段。

#### 题外话

项目目前处于小孩子刚出生阶段，会有很多的需要待完善的点，各位大佬有意见和需求和项目不足点欢迎提出来，我虚心学习请教。

生活中是卑微的打工人，社恐五颗星，大家口下留情，被业务折磨已经身心疲惫了。

祝大家：财源广进，金玉满堂，身体健康，笑口常开，吉祥如意乐无边！

<br />

## 🎨 预览

[点击链接直达预览地址](https://chenbz777.github.io/questionnaire_web/questionnaire/v1/design)

![设计页面](https://ice.frostsky.com/2024/09/13/b7987b8e01f2b9ec622aaab65dbc39a8.png)

<br />

## 🌈 技术栈

```
vue3
```

<br />

## 📦 仓库

[questionnaire_web](https://github.com/chenbz777/questionnaire_web)

<br />

## 💻 初始化

```bash
pnpm install
```

<br />

## 🚀 启动

```bash
pnpm dev
```

<br />

## 🛠️ 打包

```bash
pnpm build
```

<br />

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

<br />

## ✨ 使用方法

### 集成【设计问卷】

> 查看项目 `views/questionnaire/v1/demo/design.vue`

<br />

### 集成【填写问卷】

> 查看项目 `views/questionnaire/v1/demo/answer.vue`

<br />

### 集成【设计题目】

> 查看项目 `views/questionnaire/v1/demo/designQuestion.vue`

<br />

### 集成【填答简洁版问卷】

> 用法与【填答问卷】一致，只是去掉了"皮肤"样式

<br />

### 集成【只读简洁版问卷】

> 用法与【只读问卷】一致，只是去掉了"皮肤"样式

<br />

## 🏗️ 待完善

1. [控件] 日期时间

   > 暂时还没找到好的日期时间插件，后续再补充

<br />

## 📌 许可协议

本项目基于 MIT 许可证开源，详情请参阅 [LICENSE](./LICENSE) 文件。

<br />

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

<br />

## 🆕 更新

2024/9/12，新增【考试】、【模版库】功能

考试

![考试](https://ice.frostsky.com/2024/09/13/ce5450424fbe5599ad2b28f9832e7d75.png)

模版库

![模版库](https://ice.frostsky.com/2024/09/13/b20d0ce86fddd0b7c5d1017c89803a6a.png)

<br />

2024/9/14，新增【设计题目】页面

可以通过【设计题目】页面 单独设计题目，多个题目可以形成“题库”
