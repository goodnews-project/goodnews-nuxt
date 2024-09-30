import { useArticleStore } from '@/stores/articleStore';
import { recordTweetView } from '~/api/tweet';

export default defineNuxtPlugin(() => {
  onNuxtReady(({ app }) => {
    const articleStore = useArticleStore();
    setInterval(async () => {
      if (articleStore.readArticleIds.length > 0) {
        try {
          await recordTweetView(articleStore.readArticleIds.join(','));
          // 清空已发送的文章ID
          articleStore.clearArticleIds();
        } catch (error) {
          console.error('Failed to send article IDs:', error);
        }
      }
    }, 20000);
  });
});
