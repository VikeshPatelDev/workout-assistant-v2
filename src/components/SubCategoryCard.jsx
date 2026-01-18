import { Link } from 'react-router-dom';

function SubCategoryCard({ subCategory, categoryId }) {
  return (
    <Link
      to={`/category/${categoryId}/${subCategory.id}`}
      className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-6 min-h-[120px] flex flex-col justify-center items-center text-center transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`View ${subCategory.label} exercises`}
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-2">
        {subCategory.label}
      </h3>
      <p className="text-sm text-gray-300">
        {subCategory.videos?.length || 0} videos
      </p>
    </Link>
  );
}

export default SubCategoryCard;

