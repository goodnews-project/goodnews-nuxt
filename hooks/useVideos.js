export default function useVideos() {
  const getPlayingVideo = () => {
    return document.querySelectorAll('video[data-playing="true"]')
  }
  const pauseAllVideos = () => {
    const videos = getPlayingVideo()
    for (const video of videos) {
      video.pause()
    }
  }
  return {
    getPlayingVideo,
    pauseAllVideos
  }
}

