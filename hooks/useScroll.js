let scrollDom = null;
let currentScrollTop = 0;
export function initScroll(dom) {
  scrollDom = dom;
  window.addEventListener('scroll', () => {
    currentScrollTop = scrollDom.scrollTop;
  });
}

export function toScroll(data) {
  scrollDom.scrollTop = data;
}

export default function useScroll() {
  const scrollCache = useScrollStore();

  const setScrollCache = (key) => {
    scrollCache.setScrollCache(key, currentScrollTop);
  };
  const getScrollCache = (key) => {
    return scrollCache.getScrollCache(key) || 0;
  };
  return {
    initScroll,
    toScroll,
    setScrollCache,
    getScrollCache,
  };
}
