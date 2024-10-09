<script setup>
import notificationList from './components/list.vue';
const { t } = useI18n();
const tabList = [
  {
    name: t('notification.all'),
    key: 'all',
  },
  {
    name: t('notification.mentioned'),
    key: 'mention',
  },
];

definePageMeta({
  name: 'notification',
  middleware: ['auth'],
});

defineOptions({ name: 'notification' });

useHead({
  title: t('notification.head'),
  meta: [
    {
      name: 'description',
      content: t('notification.head'),
    },
  ],
});

const currentTab = ref(tabList[0].key);

const toToggleNav = (e) => {
  if (e.key === currentTab.value) return;
  currentTab.value = e.key;
};

const apiParams = computed(() => {
  let params = {};
  if (currentTab.value === 'mention') {
    params = {
      notify_type: '2',
    };
  }
  return params;
});
</script>

<template>
  <PageHeader> {{ t('notification.title') }} </PageHeader>
  <nav class="tab-nav">
    <div class="nav-item" v-for="item in tabList" :key="item.key" :class="{ active: item.key === currentTab }" @click="toToggleNav(item)">
      <div class="item-text">
        {{ item.name }}
      </div>
    </div>
  </nav>
  <notificationList :params="apiParams"></notificationList>
</template>

<style lang="scss" scoped>
.tab-nav {
  width: 100%;
  border-bottom: 1px solid var(--color-neutral-3);
  line-height: 36px;
  display: flex;

  .nav-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 8px 0;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease-out;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .item-text {
      color: var(--color-text-2);
      width: 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-weight: 700;
      font-size: 15px;
    }
    &:hover {
      background-color: var(--color-neutral-3);
    }
    &.active {
      &::before {
        content: ' ';
        display: block;
        background: rgb(var(--arcoblue-6));
        width: 56px;
        height: 4px;
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .item-text {
        color: var(--color-text-1);
      }
    }
  }
}
</style>
