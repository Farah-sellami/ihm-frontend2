import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Container, Heading } from "../../router";

// Composant pour une seule carte de catégorie
const CategoryCard = ({ item, subcategories, onCategoryClick, onSubcategoryClick }) => {
  return (
    <div
      className="min-w-[160px] h-[200px] flex-shrink-0 bg-white p-6 border rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 ease-in-out text-center mx-2 flex flex-col justify-between transform hover:scale-105"
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-20 h-20 object-cover rounded-full mb-4 mx-auto"
      />
      <h3
        className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition duration-200"
        onClick={() => onCategoryClick(item.id)}
      >
        {item.title}
      </h3>
      {subcategories && subcategories.length > 0 && (
        <div className="mt-2 text-left">
          <ul className="list-none pl-0 text-xs text-gray-600 space-y-1">
            {subcategories.map((subcategory) => (
              <li
                key={subcategory.id}
                className="cursor-pointer py-2 px-4 rounded-lg hover:bg-blue-100 hover:text-blue-600 hover:underline transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
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

CategoryCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
  subcategories: PropTypes.array,
  onCategoryClick: PropTypes.func,
  onSubcategoryClick: PropTypes.func,
};

// Composant pour le slider de catégories
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
          `http://localhost:8000/api/categories/${categoryId}/subcategories`
        );
        const data = await response.json();

        // Assurer que 'sous_categories' est un tableau
        const subcategories = Array.isArray(data.sous_categories)
          ? data.sous_categories
          : [];

        setSubcategoryMap((prev) => ({
          ...prev,
          [categoryId]: subcategories,
        }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    if (onSubcategorySelect) {
      onSubcategorySelect(subcategoryId);
    } else {
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
      <br />
      <Container>
        {/* Heading */}
        <Heading
          title="Browse the categories"
          subtitle="Most viewed and Popular Categories"
        />

        {/* Arrows + Slider */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll(-300)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 border border-blue-600 rounded-full shadow-lg p-3 z-10 hover:bg-blue-600 hover:text-white transition duration-300"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Scrollable Category List */}
          <div
            ref={containerRef}
            className="flex overflow-x-hidden no-scrollbar py-4"
          >
            {filteredCategories.map((item) => (
              <CategoryCard
                key={item.id}
                item={{
                  id: item.id,
                  title: item.titre,
                  image: item.image,
                }}
                subcategories={subcategoryMap[item.id]}
                onCategoryClick={handleCategoryClick}
                onSubcategoryClick={handleSubcategoryClick}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll(300)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 border border-blue-600 rounded-full shadow-lg p-3 z-10 hover:bg-blue-600 hover:text-white transition duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </Container>
    </section>
  );
};

CategorySlider.propTypes = {
  onSubcategorySelect: PropTypes.func,
};
