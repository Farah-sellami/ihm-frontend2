import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Container, Heading } from "../../router";

const CategoryCard = ({ item, subcategories, onClick }) => {
  return (
    <div
      className="category-card bg-white p-4 border rounded-lg shadow-md hover:shadow-lg cursor-pointer transition duration-200 ease-in-out text-center"
      onClick={() => onClick(item.id)} // Fetch subcategories when clicked
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{item.title}</h3>
      {/* Subcategories section */}
      {subcategories && subcategories.length > 0 && (
        <div className="mt-4 text-left">
          <ul className="list-disc pl-6 text-sm text-gray-600">
            {subcategories.map((subcategory) => (
              <li key={subcategory.id}>{subcategory.titre}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export const CategorySlider = () => {
  const [categories, setCategories] = useState([]); // State for categories
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [subcategoryMap, setSubcategoryMap] = useState({}); // State to map categories to subcategories

  // Fetch categories from the backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories for a specific category and update the map
  const handleCategoryClick = async (categoryId) => {
    try {
      if (subcategoryMap[categoryId]) {
        // If subcategories already exist, toggle them off
        setSubcategoryMap((prev) => {
          const updatedMap = { ...prev };
          delete updatedMap[categoryId];
          return updatedMap;
        });
      } else {
        // If subcategories don't exist, fetch and add them
        const response = await fetch(`http://localhost:8000/api/categories/${categoryId}/scategories`);
        const subcategories = await response.json();
        setSubcategoryMap((prev) => ({ ...prev, [categoryId]: subcategories }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  
  // Filter categories based on the search term
  const filteredCategories = categories.filter((item) =>
    item.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="category-slider pb-16 bg-gray-100">
      <Container>
        {/* Search Box */}
        <div className="mb-6 relative w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-9 pr-24 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm transition">
            Search
          </button>
        </div>

        <Heading
          title="Browse the categories"
          subtitle="Most viewed and all-time top-selling category"
        />

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredCategories.map((item) => (
            <CategoryCard
              key={item.id}
              item={{ id: item.id, title: item.titre }}
              subcategories={subcategoryMap[item.id]} // Pass subcategories for the category
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};