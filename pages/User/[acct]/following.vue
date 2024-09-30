<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import UserList from '@/components/User/UserList.vue';
import { getUserInfo } from '@/api/base';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

definePageMeta({
  name: 'acct-following',
});

const type = route.name == 'acct-following' ? 'following' : 'follower';

// 外站链接
const hrefLink = ref('');

const fetchData = async () => {
  const { data } = await getUserInfo(route.params.acct);
  hrefLink.value = data.value.account.url;
};

await fetchData();

const tabList = [
  { key: 'acct-follower', name: t('account.follower') },
  { key: 'acct-following', name: t('account.following') },
];
const toToggleNav = (item: any) => {
  router.push({ name: `${item.key}`, params: { acct: route.params.acct } });
};
</script>

<template>
  <div class="search-view">
    <PageHeader>{{ route.params.acct }}</PageHeader>
    <section>
      <nav class="tab-nav">
        <div class="nav-item" v-for="item in tabList" :key="item.key" :class="{ active: item.key === route.name }" @click="toToggleNav(item)">
          <div class="item-text">
            {{ item.name }}
          </div>
        </div>
      </nav>
      <UserList :url="`/_api/v1/account/${route.params.acct}/${type}`"> </UserList>
      <div class="follow-tips" v-if="hrefLink">
        <div class="line">{{ t('account.hideFollowers') }}</div>
        <div class="line">
          <a-link class="hrefLink" :href="hrefLink" target="_blank">{{ t('account.viewDetail') }}</a-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.follow-tips {
  padding: 10px;
  font-size: 14px;
  color: var(--light-secondary);
  text-align: center;
  .line {
    padding: 5px 0;
  }
}
.tab-nav {
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
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
      color: #536471;
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
        color: #0f1419;
      }
    }
  }
}
</style>
