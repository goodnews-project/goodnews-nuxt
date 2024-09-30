<script setup>
const { t } = useI18n();
definePageMeta({
  name: 'lists',
});
useHead({
  title: t('list.title'),
  meta: [
    {
      name: 'description',
      content: t('list.title'),
    },
  ],
});
const newListsName = ref('');
import { getlistsData, createList } from '@/api/lists';
const { data, loading } = await getlistsData();
const lists = ref(data.value?.data || []);
const addLoading = ref(false);
const addLists = async () => {
  if (!newListsName.value) {
    return;
  }
  if (newListsName.value.length < 3) {
    return;
  }
  addLoading.value = true;
  try {
    await createList({ title: newListsName.value });
    const { data } = await getlistsData();
    lists.value = data.value.data;
    newListsName.value = '';
  } catch (error) {
    console.log('error', error);
    addLoading.value = false;
  } finally {
    addLoading.value = false;
  }
};

const router = useRouter();
const goDetails = (e) => {
  router.push({ name: 'lists-id', params: { id: e.id } });
  sessionStorage.setItem('lists', JSON.stringify(e));
};

const disabledTitle = computed(() => {
  let str = '';
  if (!newListsName.value) {
    str = t('list.pleaseEnterTitle');
  } else if (newListsName.value.length < 3) {
    str = t('list.titleLengthCannotBeLessThan', { length: 3 });
  }
  return str;
});
</script>

<template>
  <div class="pages">
    <PageHeader> {{ t('list.title') }} </PageHeader>
    <div class="container">
      <div class="handle">
        <a-input :placeholder="t('list.newListsTitle')" v-model="newListsName"></a-input>
        <a-button type="primary" :disabled="!newListsName || newListsName.length < 3" @click="addLists" :loading="addLoading" :title="disabledTitle">
          {{ t('list.createNewList') }}
        </a-button>
      </div>
      <div class="mylists">
        <div class="mylists-title">
          {{ t('list.yourLists') }}
        </div>
        <div class="mylists-list">
          <a-link class="mylists-item" v-for="item in lists" @click="goDetails(item)">
            <div class="icon"><Icon name="material-symbols-light:lists-rounded" /></div>
            <div class="title">{{ item.title }}</div>
          </a-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.handle {
  padding: 10px;
  display: flex;
  gap: 10px;
}
.mylists {
  padding: 10px 0;
  &-title {
    padding: 10px;
    border-top: 1px solid var(--color-neutral-3);
    border-bottom: 1px solid var(--color-neutral-3);
    background: var(--color-neutral-2);
  }
  &-list {
    .mylists-item {
      padding: 10px;
      border-bottom: 1px solid var(--color-neutral-3);
      cursor: pointer;
      display: flex;
      gap: 6px;
      align-items: center;
      color: var(--color-neutral-10);
      .title {
        font-size: 16px;
        flex: 1;
      }
      .icon {
        font-size: 18px;
      }

      &:hover {
        background: var(--color-neutral-2);
      }
    }
  }
}
</style>
