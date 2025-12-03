declare global {
  interface Window {
    YOUTUBE?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

export function loadYouTubeIframeAPI(): Promise<any> {
  return new Promise((resolve) => {
    if (window.YOUTUBE && window.YOUTUBE.Player) {
      resolve(window.YOUTUBE);
      return;
    }

    if (document.querySelector(`script[src='${YOUTUBE_IFRAME_API_SRC}']`)) {
      const interval = window.setInterval(() => {
        if (window.YOUTUBE && window.YOUTUBE.Player) {
          window.clearInterval(interval);
          resolve(window.YOUTUBE);
        }
      }, 50);
      return;
    }

    const tag = document.createElement("script");
    tag.src = YOUTUBE_IFRAME_API_SRC;

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YOUTUBE);
    };
  });
}
