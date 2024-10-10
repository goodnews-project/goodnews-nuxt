<template>
  <div class="link-footer">
    <ul>
      <li v-for="item in linkList">
        <template v-if="item.trigger">
          <a-trigger position="top" auto-fit-position :popup-translate="[0, -10]" scroll-to-close>
            <nuxt-link :to="item.link" :target="item.target">{{ item.name }}</nuxt-link>
            <template #content>
              <div class="demo-basic">
                <img :src="item.triggerImgSrc" />
              </div>
            </template>
          </a-trigger>
        </template>
        <template v-if="!item.trigger">
          <nuxt-link :to="item.link" :target="item.target">{{ item.name }}</nuxt-link>
        </template>
        <span v-if="item.showpoint">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { t } = useI18n();
import { version } from '../../package.json';
const props = defineProps({
  showData: {
    type: Array,
    default: () => [],
  },
});
const linkList = computed(() => {
  const aboutData = {
    name: t('about.title'),
    link: '/about',
    showpoint: true,
    target: '',
  };

  const githubData = {
    name: t('about.github'),
    link: 'https://github.com/goodnews-project/goodnews-nuxt/',
    showpoint: true,
    target: '_blank',
  };

  const versionData = {
    name: `v${version}`,
    link: 'https://github.com/goodnews-project/goodnews-nuxt/releases',
    showpoint: false,
    target: '_blank',
  };

  let result = [];

  const keyMap = {
    about: aboutData,
    github: githubData,
    version: versionData,
  };
  if (props.showData.length === 0) {
    // 全要
    result = Object.values(keyMap);
  } else {
    // 循环keyMap
    Object.keys(keyMap).forEach((key) => {
      if (props.showData.includes(key)) {
        result.push(keyMap[key]);
      }
    });
  }

  return result;
});
</script>

<style scoped lang="scss">
.link-footer {
  margin-top: 1rem;
  line-height: 1.5;

  margin-top: auto;
  font-size: 14px;
  color: var(--color-neutral-6);
  padding-bottom: 24px;
  ul {
    display: flex;
    li {
      & + li {
        position: relative;
      }
      a {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.demo-basic {
  width: 140px;
  height: 140px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--color-neutral-3);
  box-shadow: 0px 8px 40px 0px #00000014;
  img {
    width: 100%;
  }
}
</style>
