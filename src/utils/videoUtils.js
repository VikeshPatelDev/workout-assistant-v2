/**
 * Extract video ID from YouTube URL
 * Handles: watch URLs (?v=VIDEO_ID), Shorts URLs (/shorts/VIDEO_ID), embed URLs (/embed/VIDEO_ID)
 */
export const extractVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Prefer query param 'v' when present (for watch URLs)
    const vParam = urlObj.searchParams.get('v');
    if (vParam) {
      return vParam;
    }
    
    // Check for Shorts URLs: /shorts/VIDEO_ID
    const shortsMatch = urlObj.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) {
      return shortsMatch[1];
    }
    
    // Check for embed URLs: /embed/VIDEO_ID
    const embedMatch = urlObj.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) {
      return embedMatch[1];
    }
    
    // Fallback: extract from pathname (last non-empty segment)
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
    if (pathParts.length > 0) {
      const videoId = pathParts[pathParts.length - 1];
      // Basic validation: YouTube video IDs are typically 11 characters
      if (videoId && videoId.length >= 10) {
        return videoId;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
};

/**
 * Find a video in a list by matching its extracted video ID
 */
export const findVideoById = (videos, videoId) => {
  if (!videos || !videoId) return null;
  
  return videos.find(video => {
    const id = extractVideoId(video.url);
    return id === videoId;
  });
};

