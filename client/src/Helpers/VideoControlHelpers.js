export function formatDuration(time) {
  if (isNaN(time)) {
    return null
  }
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

// Timeline
// timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
// timelineContainer.addEventListener("mousedown", toggleScrubbing)
// document.addEventListener("mouseup", e => {
//   if (isScrubbing) toggleScrubbing(e)
// })
// document.addEventListener("mousemove", e => {
//   if (isScrubbing) handleTimelineUpdate(e)
// })

// let isScrubbing = false
// let wasPaused
// function toggleScrubbing(e) {
//   const rect = timelineContainer.getBoundingClientRect()
//   const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
//   isScrubbing = (e.buttons & 1) === 1
//   videoContainer.classList.toggle("scrubbing", isScrubbing)
//   if (isScrubbing) {
//     wasPaused = video.paused
//     video.pause()
//   } else {
//     video.currentTime = percent * video.duration
//     if (!wasPaused) video.play()
//   }

//   handleTimelineUpdate(e)
// }

// function handleTimelineUpdate(e) {
//   const rect = timelineContainer.getBoundingClientRect()
//   const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
//   const previewImgNumber = Math.max(
//     1,
//     Math.floor((percent * video.duration) / 10)
//   )
//   const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
//   previewImg.src = previewImgSrc
//   timelineContainer.style.setProperty("--preview-position", percent)

//   if (isScrubbing) {
//     e.preventDefault()
//     thumbnailImg.src = previewImgSrc
//     timelineContainer.style.setProperty("--progress-position", percent)
//   }
// }