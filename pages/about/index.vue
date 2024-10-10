<script setup>
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { getDesc } from '@/api/about';
import { getInstance } from '@/api/setting';
import CustomImage from '@/components/CustomImage/index.vue';
const { t } = useI18n();
const { VITE_SYS_NAME: systemName } = import.meta.env;
useHead({
  title: t('about.head', { systemName }),
  meta: [
    {
      name: 'description',
      content: t('about.head', { systemName }),
    },
  ],
});
definePageMeta({
  layout: 'default',
  name: 'about',
});

const [{ data: descData }, { data: instanceData }] = await Promise.all([getDesc(), getInstance()]);

const renderImg = computed(() => {
  return instanceData.value?.contact?.account?.avatar || defaultAvatar;
});
</script>

<template>
  <div class="pagesAbout">
    <div class="containerAbout" v-if="instanceData">
      <div class="title">{{ instanceData.title }}</div>
      <div class="img-box">
        <CustomImage :src="instanceData?.thumbnail?.url" class="image" alt="" />
      </div>
      <div class="desc">{{ instanceData.description }}</div>
      <div class="statistics-form">
        <div class="form-item">
          <div class="form-item-label">{{ t('layout.siteAdmin') }}</div>
          <div class="form-item-value" v-if="instanceData?.contact?.account">
            <UserCard :account="instanceData?.contact?.account">
              <div class="user">
                <NuxtLink class="user-photo" :to="`/user/${instanceData?.contact?.account?.acct}`">
                  <CustomImage :src="renderImg" />
                </NuxtLink>
                <div class="user-text">
                  <div class="user-name">
                    {{ instanceData?.contact?.account.display_name || instanceData?.contact?.account.username }}
                  </div>
                  <div class="user-desc">{{ t('layout.admin') }}</div>
                </div>
              </div>
            </UserCard>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-label">{{ t('layout.contact') }}</div>
          <div class="form-item-value">
            <div class="text-value">{{ instanceData?.contact?.email }}</div>
          </div>
        </div>
      </div>

      <a-collapse class="custom-collapse" :default-active-key="['1']">
        <a-collapse-item :header="t('about.title')" key="1">
          <div class="collapse-content" v-html="descData.content"></div>
        </a-collapse-item>
        <a-collapse-item :header="t('about.siteRules')" key="2">
          <div class="collapse-content w-full">
            <div class="w-full h-[100px">
              <div class="wrap" v-for="(rule, index) in instanceData.rules" :key="rule.id">
                <div class="right">{{ index + 1 }}</div>
                <div class="left">
                  {{ rule.text }}
                </div>
              </div>
            </div>
          </div>
        </a-collapse-item>
      </a-collapse>
    </div>
    <div class="footer">
      <AboutInstructions :showData="['github', 'version']"></AboutInstructions>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagesAbout {
  width: 100%;
  height: 100%;
  padding: 10px;
}

.containerAbout {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .img-box {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-text-1);
    margin-bottom: 20px;
  }

  .statistics-form {
    --line-color: var(--color-border-2);
    display: flex;
    width: 100%;
    gap: 10px;
    border-radius: 5px;
    margin-top: 10px;
    border: 1px solid var(--line-color);

    .form-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      padding: 20px;
      gap: 10px;

      &:last-child {
        position: relative;

        &::before {
          content: ' ';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          height: 80%;
          width: 1px;
          background: var(--line-color);
        }
      }

      .form-item-label {
        font-size: 14px;
      }

      .form-item-value {
        display: flex;
        flex-direction: column;

        .user {
          display: flex;
          gap: 10px;
          align-items: center;

          .user-photo {
            width: 36px;
            height: 36px;
            border-radius: 4px;
            overflow: hidden;

            img {
              cursor: pointer;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .user-text {
            .user-name {
              font-weight: bold;
              font-size: 14px;
              color: var(--color-text-1);
              cursor: pointer;
            }

            .user-desc {
              font-size: 12px;
              color: var(--color-text-2);
            }
          }
        }

        .text-value {
          color: var(--color-text-1);
          font-weight: bold;
        }
      }
    }
  }

  .custom-collapse {
    width: 100%;
    margin-top: 20px;

    .collapse-content {
      padding: 10px 20px;
    }

    .wrap {
      border-bottom: 1px solid var(--color-border-1);
      padding: 16px 16px 16px 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .right {
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 0.75rem;
        background-color: rgb(var(--primary-6));
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      .left {
        flex: 1;
      }
    }
  }
}

.footer {
  text-align: center;
  margin-top: 10px;
}
</style>
