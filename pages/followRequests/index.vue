<script setup>
const { t } = useI18n();
import { getList, handleAuthorize, reject } from '~/api/followRequests';

const { data: followRequests, pending: pageLoading, refresh: getListAsync } = await getList();

defineOptions({ name: 'followRequests' });

useHead({
  title: t('followRequests.head'),
  meta: [
    {
      name: 'description',
      content: t('followRequests.head'),
    },
  ],
});

onMounted(async () => {
  await nextTick();
});
const notificationsNum = useNotificationsNum();

const handleAuthorizeAsync = async (item) => {
  try {
    item._loading = true;
    await handleAuthorize(item);
    notificationsNum.value.follow_requests -= 1;
    followRequests.value = followRequests.value.filter((i) => i.id !== item.id);
  } catch (err) {
    console.log(err);
  } finally {
    item._loading = false;
  }
};
const rejectAsync = async (item) => {
  try {
    item._loading = true;
    await reject(item);
    notificationsNum.value.follow_requests -= 1;
    followRequests.value = followRequests.value.filter((i) => i.id !== item.id);
  } catch (err) {
    console.log(err);
  } finally {
    item._loading = false;
  }
};
</script>

<template>
  <div class="pages">
    <PageHeader> {{ t('followRequests.title') }} </PageHeader>
    <a-spin class="content-wrap" v-if="followRequests?.length" :loading="pageLoading">
      <div v-for="item in followRequests" :key="item.id" class="content">
        <userItem :data="item"></userItem>
        <div class="follow-bar">
          <div class="spin" v-if="item._loading">
            <a-spin></a-spin>
          </div>
          <template v-else>
            <div class="follow-bar-item" @click="handleAuthorizeAsync(item)">
              <Icon name="material-symbols:check" />
            </div>
            <div class="follow-bar-item" @click="rejectAsync(item)">
              <Icon name="material-symbols:close" />
            </div>
          </template>
        </div>
      </div>
    </a-spin>
    <div v-if="!pageLoading && !followRequests?.length" class="null-list">
      <div class="title">{{ t('common.nullTip') }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-wrap {
  display: block;
}
.follow-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border: 1px solid var(--color-fill-3);
  border-left: none;
  border-right: none;
  padding: 10px;
  .follow-bar-item {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: var(--color-neutral-6);
    cursor: pointer;
    height: 100%;
    &:hover {
      color: rgb(var(--arcoblue-6));
    }
  }
}
.null-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .title {
    color: var(--color-neutral-6);
    font-size: 24px;
    font-weight: 500;
  }
}
</style>
