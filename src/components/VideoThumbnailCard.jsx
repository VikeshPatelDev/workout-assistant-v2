import { Link } from 'react-router-dom';
import { extractVideoId } from '../utils/videoUtils';

function VideoThumbnailCard({ video, categoryId, subcategoryId, onSelect, isSelected = false, onToggleSelect, selectionMode = false }) {
  const videoId = extractVideoId(video.url);
  
  if (!videoId) {
    return null;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Build video URL path
  const buildVideoPath = () => {
    if (subcategoryId) {
      return `/category/${categoryId}/${subcategoryId}/${videoId}`;
    } else {
      return `/category/${categoryId}/${videoId}`;
    }
  };

  const handleToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleSelect) {
      onToggleSelect(video);
    }
  };

  // In selection mode, use button with toggle
  if (selectionMode) {
    return (
      <div className="relative w-full">
        <button
          onClick={handleToggleClick}
          className={`w-full bg-gray-800 rounded-lg overflow-hidden transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
          aria-label={`Select ${video.title}`}
        >
          <div className="relative w-full aspect-video bg-gray-700">
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-600' : 'bg-gray-800 bg-opacity-70'}`}>
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 text-left">
            <h3 className="text-base font-semibold text-white line-clamp-2">
              {video.title}
            </h3>
          </div>
        </button>
      </div>
    );
  }

  // In normal mode, use Link for navigation
  return (
    <div className="relative w-full">
      <Link
        to={buildVideoPath()}
        className={`w-full bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 block ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
        aria-label={`Play ${video.title}`}
      >
        <div className="relative w-full aspect-video bg-gray-700">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-red-600 bg-opacity-90 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4 text-left">
          <h3 className="text-base font-semibold text-white line-clamp-2">
            {video.title}
          </h3>
        </div>
      </Link>
    </div>
  );
}

export default VideoThumbnailCard;

