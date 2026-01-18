import SubCategoryCard from './SubCategoryCard';

function SubCategoryGrid({ subCategories, categoryId }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {subCategories.map((subCategory) => (
        <SubCategoryCard
          key={subCategory.id}
          subCategory={subCategory}
          categoryId={categoryId}
        />
      ))}
    </div>
  );
}

export default SubCategoryGrid;

