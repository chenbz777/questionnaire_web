module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-essential'
  ],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'vue'
  ],
  'rules': {
    'indent': [
      'error',
      2,
      { SwitchCase: 1 }
    ],
    'linebreak-style': 'off',
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'vue/multi-word-component-names': 'off',
    //  数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号
    'comma-dangle': [2, 'never'],
    // 使用类型安全的 === 和 !== 操作符代替 == 和 != 除null以外
    eqeqeq: [2, 'always', { null: 'ignore' }],
    // 强制 generator 函数中 * 号周围使用一致的空格
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    // 禁止条件表达式中出现赋值操作符
    'no-cond-assign': 2,
    // 禁止修改 const 声明的变量
    'no-const-assign': 2,
    // 禁止在嵌套的块中出现 function 或 var 声明
    'no-inner-declarations': [2, 'functions'],
    // 不允许空格和 tab 混合缩进
    'no-mixed-spaces-and-tabs': 2,
    // 禁止出现未使用过的变量
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none'
      }
    ],
    // 强制执行驼峰命名约定
    'camelcase': ['error', {
      'properties': 'always',  // 强制属性名也使用驼峰命名
      'ignoreDestructuring': false,  // 忽略解构赋值的变量名
      'ignoreImports': false  // 忽略导入的变量名
    }],
    // 对所有控制语句强制使用一致的大括号样式
    'curly': ['error', 'all']
  }
};
