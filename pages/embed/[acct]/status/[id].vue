<script setup>
import { getTweetDetail, getTweetContext } from '@/api/tweet'
import { watchEffect } from 'vue'
const route = useRoute()
const params = {
  acct: route.params.acct,
  id: route.params.id
}
const tweetData = ref(null)
onMounted(async () => {
  const { data } = await getTweetDetail(params)
  console.log('data',data.value);
  tweetData.value = data.value
})

watchEffect(async () => {
  const { data } = await getTweetDetail(params)
  tweetData.value = data.value
})
</script>

<template>
  <TweetMessage v-if="tweetData" :status="tweetData" :showMoreHandle="false"></TweetMessage>
</template>
