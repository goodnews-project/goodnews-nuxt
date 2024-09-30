<script setup>
import { ref, computed, watch, watchEffect } from 'vue';
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
});
const fileList = ref([]);
watchEffect(() => {
  props.modelValue;
  fileList.value = props.modelValue.filter((item, i) => i < 4);
});
const emit = defineEmits(['update:modelValue']);
const removeItem = (index) => {
  const file = fileList.value[index];
  file.abort && file.abort();
  fileList.value.splice(index, 1);
  emit('update:modelValue', fileList.value);
};

const format = (item) => {
  const maxNum = item.status === 'success' ? 1 : 0.9999;
  const originNum = item.percent / 100;
  let num = Math.min(originNum, maxNum);
  num = Number(num.toFixed(4));
  return num;
};

const styleResult = ref([]);
const assetsBlockStyles = (index) => {
  const length = index;
  let result = [];
  if (length === 1) {
    result = [
      {
        width: '100%',
        height: '100%',
        inset: 'auto 2px auto 2px',
      },
    ];
  } else if (length === 2) {
    result = [
      {
        width: 'calc(50% - 5px)',
        height: '100%',
        inset: 'auto auto auto auto',
      },
      {
        width: 'calc(50% - 5px)',
        height: '100%',
        inset: 'auto 0 auto auto',
      },
    ];
  } else if (length === 3) {
    result = [
      {
        width: 'calc(50% - 5px)',
        height: '100%',
        inset: '0 auto 0 0',
      },
      {
        width: 'calc(50% - 5px)',
        height: 'calc(50% - 5px)',
        inset: '0 0 auto auto',
      },
      {
        width: 'calc(50% - 5px)',
        height: 'calc(50% - 5px)',
        inset: 'auto 0 0 auto',
      },
    ];
  } else if (length === 4) {
    result = [
      {
        width: 'calc(50% - 5px)',
        height: 'calc(50% - 5px)',
        inset: '0 auto auto 0',
      },
      {
        width: 'calc(50% - 5px)',
        height: 'calc(50% - 5px)',
        inset: '0 0 auto auto',
      },
      {
        width: 'calc(50% - 5px)',
        height: 'calc(50% - 5px)',
        inset: 'auto auto 0 0',
      },
      {
        width: 'calc(50% - 5px)',
        height: 'calc(50% - 5px)',
        inset: 'auto 0 0 auto',
      },
    ];
  }
  styleResult.value = result;
};
watchEffect(() => {
  assetsBlockStyles(fileList.value.length);
});
const showControls = ref(false);
watchEffect(() => {
  props.modelValue;
  let videoFile = props.modelValue.find((item) => item.fileType === 4);
  if (videoFile && videoFile.status === 'success') {
    showControls.value = true;
  }
});
</script>

<template>
  <div class="imageList">
    <a-image-preview-group infinite>
      <div class="item" v-for="(item, index) in fileList" :class="{ fail: item.status === 'fail' }" :style="styleResult[index]">
        <template v-if="item.fileType === 1">
          <div class="photo w-full h-full">
            <a-image class="image" :src="item.base64 || item.response.url" fit="scale-down" />
            <div class="percent" v-if="item.status === 'pending'">
              <a-progress :percent="format(item)" type="circle" />
            </div>
            <div class="remove-icon" @click.stop="removeItem(index)">
              <Icon name="material-symbols:close" />
            </div>
          </div>
        </template>
        <template v-else-if="item.fileType === 4">
          <div class="photo video">
            <div class="percent" v-if="item.status === 'pending'">
              <a-progress :percent="format(item)" type="circle" />
            </div>
            <video :src="item.base64 || item.response.url" :controls="showControls" :type="item.media_type"></video>
            <div class="remove-icon" @click.stop="removeItem(index)">
              <Icon name="material-symbols:close" />
            </div>
          </div>
        </template>
      </div>
    </a-image-preview-group>
  </div>
</template>

<style scoped lang="scss">
.imageList {
  --height: 310px;
  --column-gap: 10px;
  margin-bottom: 10px;

  position: relative;
  height: var(--height);
  .item {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    border: 0;
    display: block;
    float: left;
    border-radius: 4px;
    display: flex;
    align-items: center;
    overflow: hidden;
    .photo {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      background-color: #d7d7d7;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center;
      background-size: contain;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .image {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
      .remove-icon {
        position: absolute;
        right: 5px;
        top: 5px;
        border-radius: 4px;
        background: rgba($color: #000000, $alpha: 0.25);
        color: #fff;
        cursor: pointer;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        &:hover {
          background-color: rgba($color: #000000, $alpha: 0.65);
        }
      }
      .percent {
        position: absolute;
        inset: 0;
        background-color: rgba($color: #000000, $alpha: 0.75);
        background-blend-mode: multiply;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    &.fail {
      .photo {
        filter: grayscale(100%);
        position: relative;
        &::after {
          content: '上传失败，请移除重试';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-size: 14px;
        }
      }
    }
    img,
    video {
      width: 100%;
      height: 100%;
      max-height: 500px;
    }
  }
}

@include respond('phone') {
  .imageList {
    --height: 200px;
  }
}
</style>
