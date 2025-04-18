import { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Container, Heading } from "../../router";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const CategoryCard = ({ item, subcategories, onCategoryClick, onSubcategoryClick }) => {
  return (
    <div className="min-w-[140px] h-[140px] flex-shrink-0 bg-white p-4 border rounded-xl shadow-md hover:shadow-lg cursor-pointer transition duration-200 ease-in-out text-center mx-2 flex flex-col justify-center">
      <h3 
        className="text-md font-semibold text-gray-800 mb-2 hover:text-blue-600"
        onClick={() => onCategoryClick(item.id)}
      >
        {item.title}
      </h3>
      {/* Subcategories */}
      {subcategories && subcategories.length > 0 && (
        <div className="mt-2 text-left">
          <ul className="list-disc pl-4 text-xs text-gray-600">
            {subcategories.map((subcategory) => (
              <li 
                key={subcategory.id}
                className="hover:text-blue-600 hover:underline"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent category click
                  onSubcategoryClick(subcategory.id);
                }}
              >
                {subcategory.titre}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const CategorySlider = ({ onSubcategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategoryMap, setSubcategoryMap] = useState({});
  const containerRef = useRef(null);
  const navigate = useNavigate();

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

  const handleCategoryClick = async (categoryId) => {
    try {
      if (subcategoryMap[categoryId]) {
        setSubcategoryMap((prev) => {
          const updatedMap = { ...prev };
          delete updatedMap[categoryId];
          return updatedMap;
        });
      } else {
        const response = await fetch(
          `http://localhost:8000/api/categories/${categoryId}/scategories`
        );
        const subcategories = await response.json();
        setSubcategoryMap((prev) => ({ ...prev, [categoryId]: subcategories }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    // You can either navigate to a subcategory page or use a callback
    if (onSubcategorySelect) {
      onSubcategorySelect(subcategoryId);
    } else {
      // Default behavior: navigate to subcategory page
      navigate(`/subcategory/${subcategoryId}`);
    }
  };

  const filteredCategories = categories.filter((item) =>
    item.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scroll = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

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

        {/* Heading */}
        <Heading title="Browse the categories" subtitle="Most viewed and all-time top-selling category" />

        {/* Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll(-300)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border rounded-full shadow p-2 z-10 hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Category list */}
          <div
            ref={containerRef}
            className="flex overflow-x-hidden no-scrollbar py-4"
          >
            {filteredCategories.map((item) => (
              <CategoryCard
                key={item.id}
                item={{ id: item.id, title: item.titre }}
                subcategories={subcategoryMap[item.id]}
                onCategoryClick={handleCategoryClick}
                onSubcategoryClick={handleSubcategoryClick}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll(300)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border rounded-full shadow p-2 z-10 hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </Container>
    </section>
  );
};