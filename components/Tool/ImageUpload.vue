<script setup>
import mitt from '@/utils/mitt';
const fileList = ref([]);
import { fileTypeMap } from '@/utils/constant.js';
import { Message } from '@arco-design/web-vue';
import { uploadFile } from '@/api/base.js';
import { v4 } from 'uuid';
const { t } = useI18n();
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});

watchEffect(() => {
  props.modelValue;
  fileList.value = props.modelValue.filter((item, i) => i < 4);
});

let controllerList = [];
const uploadBindAttrs = computed(() => {
  fileList.value;
  const getDisabled = () => {
    if (fileList.value.some((item) => item.fileType === 4)) {
      return fileList.value.length >= 1;
    } else {
      return fileList.value.length >= 4;
    }
  };
  const getAccept = () => {
    let str = 'image/*,video/*';
    if (fileList.value.length !== 0) {
      if (fileList.value.some((item) => item.fileType === 4)) {
        str = 'video/*';
      } else {
        str = 'image/*';
      }
    }
    return str;
  };
  const disabled = getDisabled();
  const accept = getAccept();
  return {
    disabled,
    accept,
    multiple: true,
  };
});

const beforeUpload = async (e) => {
  console.log('afspasfoifsanjfsal', e);
  if (e.type.includes('video')) {
    if (fileList.value.some((item) => item.fileType === 4)) {
      Message.error(t('tweet.onlyOneVideo'));
      return false;
    }
  }

  if (fileList.value.length >= 4) {
    Message.error(t('tweet.onlyFourAttachments'));
    return false;
  }

  const fileId = v4();

  const formData = new FormData();
  const file = e;
  formData.append('file', file);
  const blob = new Blob([file], { type: file.type });
  const base64 = URL.createObjectURL(blob);
  const fileObj = {
    name: file.name,
    size: file.size,
    id: fileId,
    status: 'pending',
    url: base64,
    base64: base64,
    fileType: fileTypeMap[file.type],
    media_type: file.type,
    percent: 0,
    abort: () => {
      const controller = controllerList.find((item) => item.id === fileId);
      if (controller) {
        controller.controller.abort();
      }
      return true;
    },
  };
  fileList.value.push(fileObj);
  handleUploadSuccess();

  const itemIndex = fileList.value.findIndex((item) => item.id === fileId);

  const controller = new AbortController();
  const config = {
    onUploadProgress: (processEvent) => {
      console.log('itemIndex', itemIndex);
      if (fileList.value[itemIndex]) {
        const percent = (processEvent.loaded / processEvent.total) * 100;
        fileList.value[itemIndex].percent = percent;
        handleUploadSuccess();
      }
    },
    signal: controller.signal,
  };
  controllerList.push({ id: fileId, controller: controller });

  const upload = async (file, config) => {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${import.meta.env.VITE_BASE_API}/_api/v1/attachment`, true);
      xhr.upload.onprogress = function (ev) {
        if (fileList.value[itemIndex]) {
          const percent = (ev.loaded / ev.total) * 100;
          fileList.value[itemIndex].percent = percent;
          console.log('Upload progress:', percent);
        }
      };

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            handleUploadSuccess();
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        }
      };

      xhr.send(form);
    });
  };

  await upload(file, config)
    .then((data) => {
      console.log('data=====', data);
      fileList.value[itemIndex].status = 'success';
      fileList.value[itemIndex].response = data;
      handleUploadSuccess();
    })
    .catch((error) => {
      console.log('error=====', error);
      if (fileList.value[itemIndex]) {
        fileList.value[itemIndex].status = 'fail';
        handleUploadSuccess();
      }
    });

  return false;
};

// 自定义上传
const customRequest = ({ file, data, headers, withCredentials, action, onFinish, onError, onProgress }) => {
  // 自定义上传无法精确控制每次选中的文件个数，所以不走官方的自定义上传，而是通过beforeUpload方法进行控制
  return false;
};

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const emit = defineEmits(['update:modelValue', 'processChange']);

const handleUploadSuccess = () => {
  emit('update:modelValue', fileList.value);
};

const submitTweetCb = (data) => {
  fileList.value = [];
};
onMounted(() => {
  mitt.on('submit-tweet', submitTweetCb);
});

onUnmounted(() => {
  mitt.off('submit-tweet', submitTweetCb);
});
</script>

<template>
  <div class="uploader">
    <a-upload
      v-bind="{ ...uploadBindAttrs }"
      :show-file-list="false"
      :custom-request="customRequest"
      :on-before-upload="beforeUpload"
      class="upload-handle"
      :disabled="props.disabled"
    >
      <template #upload-button>
        <a-tooltip :content="t('tweet.addMedia')" mini position="top">
          <a-button type="text" class="upload-icon" :disabled="props.disabled">
            <Icon name="ph:image-bold"></Icon>
          </a-button>
        </a-tooltip>
      </template>
    </a-upload>

    <ClientOnlyAModal v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </ClientOnlyAModal>
  </div>
</template>

<style lang="scss" scoped>
.uploader {
  .upload-handle {
    width: 40px;
    overflow: hidden;
    display: block;
  }

  .upload-icon {
    font-size: var(--btn-font-size);
  }
}
</style>
<style>
.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 130px;
}
</style>
