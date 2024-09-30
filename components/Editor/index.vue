<template>
  <div class="editor-block">
    <Editor
      style="min-height: 200px; font-size: 16px; height: 200px; --w-e-textarea-bg-color: transparent"
      v-model="defaultValue"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
      mode="simple"
      @onChange="handleChange"
      @customPaste="customPaste"
    />
  </div>
</template>

<script setup>
import { ref, computed, shallowRef, onBeforeUnmount, nextTick } from 'vue';
import '@wangeditor/editor/dist/css/style.css';
import { Editor } from '@wangeditor/editor-for-vue';
import { Boot, SlateEditor, SlateTransforms } from '@wangeditor/editor';
import { getCurrentSelection, getRangeByNode } from './utils';
import { setTweetEditor, setSlateEditor, removeTweetEditor, removeSlateEditor, getTweetEditor } from '@/utils/editor.js';
import mitt from '~/utils/mitt';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  maxLength: {
    type: [Number, String],
    default: 500,
  },
});
const emit = defineEmits(['update:modelValue', 'refer', 'close']);
const defaultValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
// 是否响应输入信息
const isInput = ref(true);

// 过滤空白字符
const filterSpace = (text) => {
  return text.replace(/\s/g, '');
};
function withBreakAndDelete(editor) {
  const { insertText, insertNode, getHtml, dangerouslyInsertHtml, deleteBackward } = editor;
  const newEditor = editor;

  // 重写insertText
  newEditor.insertText = async (t) => {
    if (isInput.value) {
      if (t === ' ') {
        const node = {
          text: ' ',
          type: 'space',
        };
        insertNode(node);
      } else {
        await nextTick();
        const rangeDom = window.getSelection().anchorNode.parentNode;
        const rangeDomText = rangeDom.innerText;
        if (rangeDomText === '') {
          const node = {
            text: '',
            type: 'text',
          };
          insertNode(node);
        } else if (rangeDomText === '@') {
          deleteBackward();
          const node = {
            text: `@${t}`,
            color: '#1d9bf0',
          };
          insertNode(node);
        } else if (rangeDomText === '#') {
          deleteBackward();
          const node = {
            text: `#${t}`,
            color: '#1d9bf0',
          };
          insertNode(node);
        } else {
          if (rangeDomText[0] === '@' || rangeDomText[0] === '#') {
            insertText(t);
          } else {
            if (rangeDomText[0] === ' ') {
              const node = {
                text: t,
                type: 'text',
              };
              insertNode(node);
            } else {
              SlateTransforms.insertText(editor, t);
            }
          }
        }
      }
    } else {
      insertText(t);
    }

    // 获取当前光标所在的标签
    // const rangeDom = window.getSelection().anchorNode.parentNode
    // const rangeDomText = rangeDom.innerText
    const rangeDom = getCurrentSelection(editor);
    const rangeDomText = filterSpace(rangeDom[0].text);
    if (rangeDomText[0] === '@' || rangeDomText === '@') {
      // 计算最后一个@符号后边的所以内容
      const searchValue = rangeDomText.split('@').pop();
      // 获取当前光标所在的标签
      const spanDom = window.getSelection().anchorNode.parentNode;
      emit('refer', searchValue, spanDom);
    } else {
      emit('close');
    }
  };

  // 重写回车事件
  newEditor.insertBreak = (t) => {
    dangerouslyInsertHtml(`<br />`);
  };

  // 重写删除事件
  newEditor.deleteBackward = (t) => {
    if (isInput.value) {
      isInput.value = false;
      deleteBackward();
      const backByNode = getCurrentSelection(editor);
      if (!backByNode[0].text) {
        const node = {
          text: '',
        };
        insertNode(node);
      }
      nextTick(() => {
        const rangeDom = getCurrentSelection(editor);
        const rangeDomText = filterSpace(rangeDom[0].text);
        if (rangeDomText.includes('@')) {
          const searchValue = rangeDomText.split('@').pop();
          const spanDom = window.getSelection().anchorNode.parentNode;
          emit('refer', searchValue, spanDom);
        } else {
          emit('close');
        }
      });
      isInput.value = true;
    }
  };

  return newEditor;
}
Boot.registerPlugin(withBreakAndDelete);
const customPaste = async (editor, event) => {
  await nextTick();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pasteText = clipboardData.getData('text');
  function isHtml(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
  }
  const isHtmlText = isHtml(pasteText);
  if (isHtmlText) {
    try {
      const div = document.createElement('div');
      div.innerHTML = pasteText;
      const text = div.innerText;
      await editor.undo();
      editor.insertText(text);
    } catch (error) {}
  } else {
    editor.insertText(pasteText);
  }
};

const editorRef = shallowRef();

const editorConfig = {
  placeholder: `${t('tweet.WhatThinking')}`,
  maxLength: Number(props.maxLength),
  hoverbarKeys: {
    link: { menuKeys: [] },
    image: { menuKeys: [] },
    divider: { menuKeys: [] },
    pre: { menuKeys: [] },
    table: { menuKeys: [] },
    video: { menuKeys: [] },
  },
  height: '100%',
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleChange = (e) => {
  const editorText = e.getText();
  mitt.emit('tweetContent', editorText);
};

const handleCreated = (editor) => {
  editorRef.value = editor;

  window.editor = editor; // 用于调试
  window.SlateEditor = SlateEditor; // 用于调试
  setTweetEditor(editor);
  setSlateEditor(SlateEditor);
};

const router = useRouter();
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
  removeTweetEditor();
  removeSlateEditor();
});

const referAdd = (item) => {
  isInput.value = false;
  const selectName = item.acct;
  const editor = editorRef.value;
  if (editor == null) return;

  const nodeToSelect = getCurrentSelection(editor);
  const newRange = getRangeByNode(editor, nodeToSelect);

  editor.select(newRange);
  editor.deleteBackward();

  const customNode = {
    type: 'mention',
    color: '#1d9bf0',
    id: item.id,
    text: `@${selectName}`,
  };
  editor.insertNode(customNode);

  isInput.value = true;
  editor.insertText(' ');
};
defineExpose({
  referAdd,
});
</script>

<style scoped lang="scss">
.editor-block {
  position: relative;
  --w-e-textarea-slight-color: var(--color-text-3);
}
:deep(.w-e-text-placeholder) {
  font-style: normal;
}
:deep(.w-e-max-length-info) {
  font-size: 12px;
}
</style>
