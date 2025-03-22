<script setup>
import { ref, toRefs, onMounted } from 'vue';
import { VueSignaturePad } from 'vue-signature-pad';


const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  emitSubscribe: {
    type: Function,
    required: true
  }
});

const { data: componentData } = toRefs(props);

const signaturePadRef = ref(null);

onMounted(() => {
  // 发送生命周期事件
  props.emitSubscribe('onMounted');

  if (componentData.value.props.defaultValue) {
    signaturePadRef.value.fromDataURL(componentData.value.props.defaultValue);
  }
});

function handleChange(value) {
  // 发送"值改变"事件
  props.emitSubscribe('onChange', value);
}

// 提交事件
function onSubmit() {

  const signatureData = signaturePadRef.value.saveSignature();

  const image = signatureData.data || '';

  componentData.value.props.defaultValue = image;

  // 发送"提交"事件
  handleChange(image);
}

// 取消事件
function onClear() {

  signaturePadRef.value.clearSignature();

  const value = '';

  componentData.value.props.defaultValue = value;

  // 发送"清空"事件
  handleChange(value);
}

// 撤销
function onUndo() {
  signaturePadRef.value.undoSignature();
}

const root = getComputedStyle(document.documentElement);

const bgColor = root.getPropertyValue('--questionnaire-content-bg-color').trim();

const color = root.getPropertyValue('--questionnaire-text-color').trim();

const options = {
  backgroundColor: bgColor,
  penColor: color
};
</script>

<template>
  <div class="advanced-signature">
    <div class="advanced-signature__signature">
      <VueSignaturePad height="200px" :options="options" ref="signaturePadRef" />
    </div>

    <div class="advanced-signature__btn mr-2" @click="onUndo()">撤销</div>
    <div class="advanced-signature__btn mr-2" @click="onClear()">清空</div>
    <div class="advanced-signature__btn advanced-signature__btn--fill" @click="onSubmit()">确定</div>
  </div>
</template>

<style scoped>
.advanced-signature__signature {
  border: 1px dotted #dadada;
  border-radius: 10px;
}

.advanced-signature__btn {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 30px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-bg-color);
  text-align: center;
  font-size: 14px;
}

.advanced-signature__btn--fill {
  background-color: var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-text-color);
}
</style>