<script setup>
const props = defineProps({
  hasPending: {
    type: Boolean,
    default: false,
  },
  hasPencent: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <div class="dashboard">
    <div v-for="(item, index) in props.data" :key="index" class="dashboard__item">
      <a class="sparkline">
        <div class="sparkline__value">
          <span class="sparkline__value__total">
            {{ item.total || 0 }}
          </span>
          <span v-show="hasPencent" class="sparkline__value__change" :class="item.rise ? 'positive' : 'negative'">
            {{ item.rate > 0 ? '+' : '' }}
            {{ item.rate || 0 }}%
          </span>
        </div>
        <div class="sparkline__label">{{ item.label }}</div>
      </a>
    </div>
    <div class="dashboard__item" v-show="hasPending">
      <a class="dashboard__quick-access">
        <span>
          <strong>{{ 0 }}</strong>
          {{ $t('admin.dashboard.pendingReports') }}
        </span>
      </a>
      <a class="dashboard__quick-access">
        <span>
          <strong>{{ 0 }}</strong>
          {{ $t('admin.dashboard.pendingUsers') }}
        </span>
      </a>
      <a class="dashboard__quick-access">
        <span>
          <strong>{{ 0 }}</strong>
          {{ $t('admin.dashboard.pendingHashtags') }}
        </span>
      </a>
      <a class="dashboard__quick-access">
        <span>
          <strong>{{ 0 }}</strong>
          {{ $t('admin.dashboard.pendingAppeals') }}
        </span>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  grid-gap: 10px;
  .dashboard__item--span-double-column {
    grid-column: span 2;
  }
  .sparkline {
    --bg-option: 0.1;
    display: block;
    text-decoration: none;
    background: var(--color-neutral-2);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      --bg-option: 0.3;
    }
    .sparkline__value {
      display: flex;
      line-height: 33px;
      align-items: flex-end;
      padding: 20px 20px 10px;
      .sparkline__value__total {
        display: block;
        margin-right: 10px;
        font-weight: 500;
        font-size: 28px;
        color: var(--color-text-1);
      }
      .sparkline__value__change {
        display: block;
        font-weight: 500;
        font-size: 18px;
        color: var(--color-text-1);
        &.positive {
          color: rgb(var(--success-6));
        }
        &.negative {
          color: var(--danger-6);
        }
      }
    }
    .sparkline__label {
      display: flex;
      padding: 0 20px 10px;
      text-transform: uppercase;
      color: var(--color-text-1);
      font-weight: 500;
    }
  }
  .dashboard__quick-access {
    display: flex;
    align-items: baseline;
    border-radius: 4px;
    background-color: var(--arcoblue-6);
    color: #000;
    transition: all 0.1s ease-in;
    font-size: 14px;
    padding: 0 16px;
    line-height: 27px;
    height: 27px;
    text-decoration: none;
    margin-bottom: 4px;
    color: #fff;
    &:hover {
      background-color: var(--arcoblue-5);
    }
    span {
      flex: 1 1 auto;
    }
  }

  .dashboard__quick-access:last-child {
    margin-bottom: 0;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
}
</style>
