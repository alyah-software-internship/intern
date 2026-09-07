const fallbackImage = "/logo.png";

export const getCategoryImageUrl = (imageUrl, backendUrl) => {
  if (!imageUrl) return fallbackImage;

  try {
    const backendOrigin = backendUrl
      ? new URL(backendUrl, window.location.origin).origin
      : window.location.origin;
    const resolvedUrl = new URL(imageUrl, backendOrigin);

    if (resolvedUrl.pathname.startsWith("/storage/")) {
      resolvedUrl.protocol = new URL(backendOrigin).protocol;
      resolvedUrl.host = new URL(backendOrigin).host;
    }

    return resolvedUrl.href;
  } catch {
    return fallbackImage;
  }
};

export const useFallbackImage = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImage;
};
