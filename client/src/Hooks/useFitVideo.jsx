import { useState } from "react";

export default function useFitVideo() {
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  function fitVideo(video, videoContainer) {
    if (video) {
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;
      const scaledHeight = (screenHeight * 96) / 100;
      const scaledWidth = (screenWidth * 96) / 100;
      let containerWidth = videoContainer.style.width;
      let containerHeight = videoContainer.style.height;

      if (
        containerHeight !== screenHeight &&
        containerHeight !== videoHeight &&
        containerWidth !== screenWidth &&
        containerWidth !== videoWidth
      ) {
        const larger = Math.max(videoWidth, videoHeight);
        const smaller = Math.min(videoWidth, videoHeight);

        if (larger === smaller) {
          return setContainerDimensions({
            width: (scaledWidth * 90) / 100,
            height: (scaledHeight * 90) / 100,
          });
        }
        // ratio of video is greater or equal to the screens ratio. (taller or wider)
        if (larger / smaller >= screenWidth / screenHeight) {
          // vertical video
          if (larger === videoHeight) {
            let newWidth = (scaledHeight * smaller) / larger;
            // if the scaled video width fits within the screen
            if (newWidth < scaledWidth) {
              return setContainerDimensions({
                width: newWidth,
                height: scaledHeight,
              });
              // if the new video's container is wider than the screen scale down to the screen
            } else if (newWidth > scaledWidth) {
              let newHeight = (scaledWidth * larger) / smaller;

              return setContainerDimensions({
                width: scaledWidth,
                height: newHeight,
              });
            }
            // horizontal video.
          } else if (larger === videoWidth) {
            let newHeight = (scaledWidth / larger) * smaller;

            return setContainerDimensions({
              width: scaledWidth,
              height: newHeight,
            });
          }
          // ratio of screen is greater or equal than the ratio of the video
        } else if (larger / smaller <= screenWidth / screenHeight) {
          // vertical video
          if (larger === videoHeight) {
            let newWidth = (scaledHeight * smaller) / larger;
            return setContainerDimensions({
              width: newWidth,
              height: scaledHeight,
            });
            // horizontal video
          } else if (larger === videoWidth) {
            let newWidth = (scaledHeight / smaller) * larger;

            return setContainerDimensions({
              height: scaledHeight,
              width: newWidth,
            });
          }
        }
      }
    }
  }
  return { fitVideo, containerDimensions };
}
