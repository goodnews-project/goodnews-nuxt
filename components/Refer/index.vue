<script setup>
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { getHashTagData } from '~/api/search';
const items = ref([]);
const loading = ref(false);
const emit = defineEmits(['confirm']);
const getList = async (searchText = null) => {
  loading.value = true;
  try {
    const { data } = await getHashTagData({
      q: '@' + searchText,
      page: 1,
      type: 'accounts',
      resolve: true,
    });
    items.value = data;
  } finally {
    loading.value = false;
  }
};
// 是否开启上下键选择
const enableUpDown = computed(() => {
  return showRefer.value && !loading.value && items.value.length > 0;
});
// 快捷选中的索引
const selectIndex = ref(0);
const showRefer = defineModel();
// 关闭选择器
const closeRefer = () => {
  selectIndex.value = 0;
  items.value = [];
  showRefer.value = false;
};
const mouseSelect = (i) => {
  selectIndex.value = i;
  commitSelect();
};
// 选中的tab显示到编辑器中
const commitSelect = () => {
  const selectItem = items.value[selectIndex.value];
  emit('confirm', selectItem);
  closeRefer();
};
// 键盘上键
const keydownUpFn = (event) => {
  if (!enableUpDown.value) return;
  event.preventDefault();
  selectIndex.value = selectIndex.value - 1;
};
// 键盘下键
const keydownDownFn = (event) => {
  if (!enableUpDown.value) return;
  event.preventDefault();
  selectIndex.value = selectIndex.value + 1;
};
// 回车键
const keydownEnterFn = (event) => {
  if (!enableUpDown.value) return;
  event.preventDefault();
  commitSelect();
};
// tab建
const keydownTabFn = (event) => {
  if (!enableUpDown.value) return;
  event.preventDefault();
  commitSelect();
};
const searchByRefer = (e) => {
  getList(e);
};

// 暴露给父组件的方法
defineExpose({
  searchByRefer,
  keydownUpFn,
  keydownDownFn,
  keydownEnterFn,
  keydownTabFn,
  closeRefer,
});
</script>

<template>
  <div class="refer-block" v-if="showRefer" v-show="loading || items.length" @keydown.down="keydownDownFn" onmousedown="return false;">
    <a-spin :loading="loading" class="loading-box">
      <a-scrollbar style="height: 300px; overflow: auto">
        <div class="refer-item" v-for="(item, i) in items" :class="{ select: i === selectIndex }" @click="mouseSelect(i)">
          <div class="user-photo">
            <a-image style="width: 40px; height: 40px" :src="defaultAvatar" />
          </div>
          <div class="user-info">
            <div class="user-name">{{ item.username }}</div>
            <div class="user-acct">{{ item.acct }}</div>
          </div>
        </div>
      </a-scrollbar>
    </a-spin>
  </div>
</template>

<style scoped lang="scss">
.refer-block {
  position: absolute;
  // top: 100px;
  left: 0;
  background: #fff;
  width: 100%;
  min-height: 100px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  z-index: 999;

  .loading-box {
    width: 100%;
  }

  .refer-item {
    height: 65px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;

    .user-photo {
      --el-image-size: 40px;
      width: var(--el-image-size);
      height: var(--el-image-size);
      margin-right: 10px;
      border-radius: var(--el-image-size);
      overflow: hidden;
    }

    .user-info {
      flex: 1;
      max-width: calc(100% - 50px);
      overflow: hidden;

      .user-name {
        color: #000;
        font-size: 16px;
        font-weight: 600;
      }

      .user-acct {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &:hover {
      background: rgb(247, 249, 249);
    }

    &.select {
      background: rgb(247, 249, 249);
    }
  }
}
</style>
