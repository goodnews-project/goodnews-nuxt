<script setup>
import { ref, reactive } from 'vue';
const { t } = useI18n();

const emit = defineEmits(['update:current']);

const props = defineProps({
  current: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const currentndex = ref(0);
const list = ref([
  { id: 0, label: t('tweet.everyone') },
  { id: 1, label: t('tweet.onlyFollowed') },
  { id: 2, label: t('tweet.onlyMentioned') },
]);

const path = reactive({
  0: 'material-symbols-light:globe-asia-sharp',
  1: 'mingcute:user-follow-2-line',
  2: 'fluent:mention-16-filled',
});

const handleClick = (index) => {
  currentndex.value = index;
  visible.value = false;
  emit('update:current', list.value[index]);
};

const visible = ref(false);
</script>

<template>
  <client-only>
    <a-trigger auto-fit-position trigger="click">
      <a-tooltip :content="t('tweet.chooseWhoCanReply')" mini position="top">
        <a-button class="frame-btn" type="text" @click="visible = true">
          <Icon name="material-symbols:globe"></Icon>
        </a-button>
      </a-tooltip>
      <template #content>
        <div class="menu">
          <div class="title">
            <div class="title-top">{{ $t('tweet.whoCanReply') }}</div>
            <div class="title-bottom">{{ $t('tweet.chooseReplyPerson') }}</div>
          </div>
          <div class="menuitem" v-for="(item, index) in list" :key="item.id" @click="handleClick(index)">
            <div class="left">
              <div class="left-icon flex justify-center items-center">
                <Icon :name="path[item.id]"></Icon>
              </div>
              <div class="left-label">{{ item.label }}</div>
            </div>
            <div class="right" v-show="item.id === props.current.id">
              <Icon name="tabler:check"></Icon>
            </div>
          </div>
        </div>
      </template>
    </a-trigger>
  </client-only>
</template>

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

.svg-wrap {
  padding: 6px 15px;
}
.svg-wrap:hover {
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
}
</style>
