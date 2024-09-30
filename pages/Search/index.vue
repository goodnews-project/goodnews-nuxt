<script setup>
import searchLayout from '@/components/SearchLayout/index.vue';
const { t } = useI18n();
useHead({
  title: t('common.search'),
  meta: [
    {
      name: 'keywords',
      content: t('common.search'),
    },
    {
      name: 'description',
      content: t('common.search'),
    },
  ],
});
definePageMeta({
  name: 'search',
});
</script>

<template>
  <PageHeader>{{ t('common.search') }}</PageHeader>
  <div class="search-pages">
    <searchLayout></searchLayout>
  </div>
</template>

<style scoped lang="scss">
.search-pages {
  width: 100%;
  padding: 10px;
}
</style>
