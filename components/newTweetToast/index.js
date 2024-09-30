import { createVNode, render } from 'vue';
import newTweetToast from '~/components/newTweetToast/tweetToash.vue';
import mitt from '@/utils/mitt';

export function useNewTweetToast() {
  const router = useRouter();
  return function showToast({ accounts, isShowNav, duration = 10000 }) {
    const showRouterList = ['home', 'public-common', 'public-local'];
    const routerName = router.currentRoute.value.name;
    if (!showRouterList.includes(routerName)) {
      return;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);

    const removeRender = () => {
      render(null, container);
      document.body.removeChild(container);
      mitt.emit('refresh-tweet-list');
    };

    const vnode = createVNode(newTweetToast, { accounts, onClick: removeRender, isShowNav });

    render(vnode, container);

    router.afterEach(() => {
      removeRender();
    });
  };
}
