import { decodeBlurHash } from 'fast-blurhash';
const getImgSize = (data) => {
  const width = 40;
  // 将高度按照宽高比例缩放，如果是小数则向上取整
  const height = Math.ceil((data.thumbnail_height * width) / data.thumbnail_width);
  return { width, height };
};
const blurhash = (data) => {
  const { width, height } = getImgSize(data);
  const blurhash = decodeBlurHash(data.blurhash, width, height);
  return blurhash;
};

self.onmessage = async function (e) {
  // 接收主线程传递的数据
  const data = e.data;
  // 执行密集计算
  const result = await performIntensiveCalculation(data);

  // 将结果发送回主线程
  self.postMessage(result);
};

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function performIntensiveCalculation(dataStr) {
  try {
    const data = JSON.parse(dataStr);
    // 在这里执行密集计算的逻辑
    const imgHash = blurhash(data);

    const { width, height } = getImgSize(data);

    // 创建 OffscreenCanvas 用于图像数据处理
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const ctx = offscreenCanvas.getContext('2d');

    // 创建 ImageData 对象，并将图像数据设置到其中
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(imgHash);

    // 将 ImageData 渲染到 OffscreenCanvas 上
    ctx.putImageData(imageData, 0, 0);

    // 将 OffscreenCanvas 转换为 Blob 对象
    const blob = await offscreenCanvas.convertToBlob();
    return blob;
  } catch (error) {
    console.error(error);
    return
  }
}
