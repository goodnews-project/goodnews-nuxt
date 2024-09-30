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
    <div
      v-for="(item, index) in props.data"
      :key="index"
      class="dashboard__item"
    >
      <a class="sparkline">
        <div class="sparkline__value">
          <span class="sparkline__value__total">
            {{ item.total || 0 }}
          </span>
          <span
            v-show="hasPencent"
            class="sparkline__value__change"
            :class="item.rise ? 'positive' : 'negative'"
          >
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
    background: rgba($color: #ccd7e0, $alpha: var(--bg-option));
    border-radius: 4px;
    position: relative;
    // padding: 0 0 75px;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      --bg-option: 0.3;
    }
    .sparkline__value {
      display: flex;
      line-height: 33px;
      // justify-content: center;
      align-items: flex-end;
      padding: 20px 20px 10px;
      .sparkline__value__total {
        display: block;
        margin-right: 10px;
        font-weight: 500;
        font-size: 28px;
        color: #000;
      }
      .sparkline__value__change {
        display: block;
        font-weight: 500;
        font-size: 18px;
        color: #282c37;
        margin-bottom: -3px;

        &.positive {
          color: #4a905f;
        }
        &.negative {
          color: #d64545;
        }
      }
    }
    .sparkline__label {
      display: flex;
      // justify-content: center;
      padding: 0 20px 10px;
      text-transform: uppercase;
      color: #282c37;
      font-weight: 500;
    }
    .sparkline__graph {
      position: absolute;
      bottom: 0;
      width: 100%;

      path {
        &:first-child {
          fill: rgba(64, 150, 255, 0.25) !important;
          fill-opacity: 1 !important;
        }
        &:last-child {
          stroke: rgb(var(--arcoblue-6)) !important;
          fill: none !important;
        }
      }
    }
  }
  .dashboard__quick-access {
    display: flex;
    align-items: baseline;
    border-radius: 4px;
    background-color: rgb(var(--arcoblue-6));
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
      background-color: rgb(var(--arcoblue-5));
    }
    span {
      flex: 1 1 auto;
    }
  }

  .dashboard__quick-access:last-child {
    margin-bottom: 0;
  }
  h4 {
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    color: #282c37;
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #c0cdd9;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  .dimension {
    table {
      width: 100%;
      .dimension__item {
        border-bottom: 1px solid #ccd7e0;
        &:last-child {
          border-bottom: 0;
        }
        .dimension__item__key {
          font-weight: 500;
          padding: 11px 10px;
          .dimension__item__indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgb(var(--arcoblue-6));
            margin-right: 10px;

            @for $i from 0 through 100 {
              &.dimension__item__indicator--#{$i} {
                background: rgba(64, 150, 255, 0.01 * $i);
              }
            }
            &.dimension__item__indicator--0 {
              background: rgba(64, 150, 255, 0.1);
            }
          }
        }
      }
    }
  }
  .retention {
    .retention__table__date {
      white-space: nowrap;
      padding: 10px 0;
      text-align: left;
      min-width: 120px;
    }
    .retention__table__size {
      text-align: center;
      padding: 10px;
    }
    .retention__table__box {
      box-sizing: border-box;
      background: rgb(var(--arcoblue-6));
      padding: 10px;
      font-weight: 500;
      color: #000;
      width: 52px;
      margin: 1px;
      @for $i from 0 through 100 {
        &--#{$i} {
          background-color: rgba(64, 150, 255, 0.01 * $i);
        }
      }
      &--0 {
        background-color: rgba(64, 150, 255, 0.1);
      }
    }
    .retention__table__number {
      color: #282c37;
      padding: 10px;
    }
    .retention__table__label {
      font-weight: 700;
      color: #282c37;
    }
  }
}
</style>
