<template>
  <div class="tweetEditor">
    <ClientOnly>
      <Editor
        ref="editorDom"
        class="editor"
        @refer="searchByRefer"
        @keydown="keyDownFn"
        @close="closeReferModel"
        v-model="defaultContent"
        v-bind="$attrs"
      ></Editor>
      <template #fallback>
        <div :style="{ width: '100%', height: '200px' }"></div>
      </template>
    </ClientOnly>
    <Refer
      ref="referDom"
      @confirm="onConfirm"
      v-model="showRefer"
      :style="{ top: `${altitudeHeight}px` }"
    ></Refer>
  </div>
</template>

<script setup>
import Editor from '@/components/Editor/index.vue';
import Refer from '@/components/Refer/index.vue';
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);
const defaultContent = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
const showRefer = ref(false);
const referDom = ref(null);
const editorDom = ref(null);
const searchText = ref('');
const altitudeHeight = ref(0);
const searchByRefer = (e, dom) => {
  console.log('🚀  48  :', dom);
  if (dom) {
    const domTop = dom.getBoundingClientRect().top;
    const editorTop = editorDom.value.$el.getBoundingClientRect().top;
    const domHeight = dom.offsetHeight;
    const top = domTop - editorTop + domHeight;
    altitudeHeight.value = top;
  }
  searchText.value = e;
  showRefer.value = true;
  referDom.value.searchByRefer(e);
};
const closeReferModel = () => {
  referDom.value.closeRefer();
};
const keyDownFn = (event) => {
  if (event.keyCode === 38) {
    // 上箭头键
    referDom.value.keydownUpFn(event);
  } else if (event.keyCode === 40) {
    // 下箭头键
    referDom.value.keydownDownFn(event);
  } else if (event.keyCode === 13) {
    // 回车
    referDom.value.keydownEnterFn(event);
  } else if (event.keyCode === 9) {
    // tab键
    referDom.value.keydownTabFn(event);
  }
};
const onConfirm = (item) => {
  editorDom.value.referAdd(item, searchText);
  searchText.value = '';
};
</script>

<style scoped lang="scss">
.tweetEditor {
  position: relative;
  border-bottom: 1px solid var(--color-neutral-4);
}
</style>
