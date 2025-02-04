"use client";

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory
}) {
  // Example categories:
  const categories = ["Music", "Dance", "Art", "Coding", "Business"];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search courses by title..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded py-2 px-4 w-full sm:w-1/2"
      />

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="border border-gray-300 rounded py-2 px-4"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
