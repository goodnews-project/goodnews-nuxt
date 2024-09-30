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
const linkList = ref([
  {
    name: t('about.title'),
    link: '/about',
    showpoint: true,
    target: '',
  },
  {
    name: t('about.app', 'Android'),
    link: '/about',
    showpoint: true,
    trigger: true,
    triggerImgSrc:
      'https://s3-alpha-sig.figma.com/img/95c9/430b/bed9b5851a1bce86c13dba48fd2b3eaf?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HF330jufllnPLyY3-SpBpqVDNd4TTrScrFeSmeTcq7v6KEj8Wg8V2daem5DswetLb0Jj-fzBlmURbUxqsXyJ02vGrFDJWJ-9ryQn8W3oyTLpwhflccAgjB95fHqWeV6q5rdfaDXVlXESfBdX53Zx-qJc9KZnSmRB-fsL2UtFP6TCpd4mBZOIXE0hS22GY7q8o-ftC63EqoKDKzKIO1U7SK8eq~YQlPqvT4~VdYp8AxQQGGyIP9uIciL-1K7bI~dYz~6d8YCnmEVOXey4apOdbI5wh0vHPq11a53wLazgHgnAL-ExPPOKTyWDyCw57PbA7drWtrf15chwk4QQABTUcQ__',
    target: '_blank',
  },
  {
    name: t('about.app', 'iOS'),
    link: '/about',
    showpoint: true,
    trigger: true,
    triggerImgSrc:
      'https://s3-alpha-sig.figma.com/img/95c9/430b/bed9b5851a1bce86c13dba48fd2b3eaf?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HF330jufllnPLyY3-SpBpqVDNd4TTrScrFeSmeTcq7v6KEj8Wg8V2daem5DswetLb0Jj-fzBlmURbUxqsXyJ02vGrFDJWJ-9ryQn8W3oyTLpwhflccAgjB95fHqWeV6q5rdfaDXVlXESfBdX53Zx-qJc9KZnSmRB-fsL2UtFP6TCpd4mBZOIXE0hS22GY7q8o-ftC63EqoKDKzKIO1U7SK8eq~YQlPqvT4~VdYp8AxQQGGyIP9uIciL-1K7bI~dYz~6d8YCnmEVOXey4apOdbI5wh0vHPq11a53wLazgHgnAL-ExPPOKTyWDyCw57PbA7drWtrf15chwk4QQABTUcQ__',
    target: '_blank',
  },
  {
    name: t('about.telegramGroup'),
    link: '/about',
    trigger: true,
    showpoint: false,
    triggerImgSrc:
      'https://s3-alpha-sig.figma.com/img/95c9/430b/bed9b5851a1bce86c13dba48fd2b3eaf?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HF330jufllnPLyY3-SpBpqVDNd4TTrScrFeSmeTcq7v6KEj8Wg8V2daem5DswetLb0Jj-fzBlmURbUxqsXyJ02vGrFDJWJ-9ryQn8W3oyTLpwhflccAgjB95fHqWeV6q5rdfaDXVlXESfBdX53Zx-qJc9KZnSmRB-fsL2UtFP6TCpd4mBZOIXE0hS22GY7q8o-ftC63EqoKDKzKIO1U7SK8eq~YQlPqvT4~VdYp8AxQQGGyIP9uIciL-1K7bI~dYz~6d8YCnmEVOXey4apOdbI5wh0vHPq11a53wLazgHgnAL-ExPPOKTyWDyCw57PbA7drWtrf15chwk4QQABTUcQ__',
    target: '_blank',
  },
]);
</script>

<style scoped lang="scss">
.link-footer {
  margin-top: 1rem;
  line-height: 1.5;

  margin-top: auto;
  font-size: 14px;
  color: var(--el-text-color-primary);
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
  border: 1px solid #e6e6e6;
  box-shadow: 0px 8px 40px 0px #00000014;
  img {
    width: 100%;
  }
}
</style>
