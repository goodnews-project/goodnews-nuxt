<template>
  <client-only>
    <a-trigger auto-fit-position trigger="click" v-model:popup-visible="visible" scroll-to-close>
      <a-tooltip :content="props.tips" mini position="top">
        <a-button class="frame-btn" type="text" @click="visible = true">
          <slot></slot>
        </a-button>
      </a-tooltip>
      <template #content>
        <div class="menu">
          <div class="title">
            <div class="title-top">{{ props.title }}</div>
          </div>
          <div class="menuitem" v-for="(item, index) in list" :key="item.value" @click="handleClick(index)">
            <div class="left">
              <div class="left-icon">
                <Icon :name="item.icon" />
              </div>
              <div class="left-label">{{ item.label }}</div>
            </div>
            <div class="right" v-show="item.value === value">
              <Icon name="tabler:check" />
            </div>
          </div>
        </div>
      </template>
    </a-trigger>
  </client-only>
</template>

<script setup>
const value = defineModel();
const props = defineProps({
  title: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  tips: { type: String, default: '' },
});
const list = ref(props.options);
const handleClick = (index) => {
  value.value = list.value[index].value;
  setTimeout(() => {
    visible.value = false;
  }, 100);
};
const visible = ref(false);
</script>

<style lang="scss" scoped>
.frame-btn {
  font-size: var(--btn-font-size);
}
.menu {
  margin-top: 10px;
  width: 300px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  .title {
    font-size: 15px;
    padding: 16px 12px;
    .title-top {
      color: rgb(15, 20, 25);
      text-overflow: unset;
      font-weight: 700;
      line-height: 20px;
      word-wrap: break-word;
    }

    .title-bottom {
      color: rgb(83, 100, 113);
      text-overflow: unset;
      font-weight: 400;
      line-height: 20px;
      word-wrap: break-word;
    }
  }

  .menuitem {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding-left: 16px;
    &:hover {
      background: var(--color-neutral-2);
    }
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      .left-icon {
        background-color: rgb(var(--arcoblue-6));
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          width: 20px;
          color: #fff;
          height: 20px;
        }
      }

      .left-label {
        color: var(--color-neutral-10);
        font-size: 15px;
        font-weight: 700;
      }
    }
    .right {
      color: rgb(var(--arcoblue-6));
      padding-right: 20px;
      font-size: 20px;
    }
  }
}
</style>
