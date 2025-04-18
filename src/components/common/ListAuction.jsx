import React, { useState, useEffect } from 'react';
import { ProductList } from '../hero/ProductList';
import { FilterSide } from './FilterSide';
import { Container, Title } from "../../router";
import { FiFilter } from 'react-icons/fi';

export const ListAuction = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [PriceFilter, setPriceFilter] = useState(null);
  // Fetch subcategories from the API
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/scategories');
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSubcategories();
  }, []);

  return (
    <>
      <div className="bg-[#20354c] pt-8 min-h-[200px] relative">
        <Container className="px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <Title level={3} className="text-white text-2xl sm:text-3xl">
              Auctions
            </Title>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Title level={5} className="text-white font-normal">
                Home
              </Title>
              <span className="text-white">/</span>
              <Title level={5} className="text-white font-normal">
                Auctions
              </Title>
            </div>
          </div>
        </Container>
      </div>
      <br /> <br />
      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-10 bg-white shadow-sm p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
        >
          <FiFilter />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-20 py-6 lg:py-10">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-0 z-20 bg-white
          transform lg:transform-none transition-transform duration-300
          ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-3/4 sm:w-1/2 lg:w-1/4 h-full lg:h-auto overflow-y-auto
        `}>
          <div className="lg:sticky lg:top-20">
            <div className="flex lg:hidden justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Filters</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <FilterSide
              subcategories={subcategories}
              onSelectSubcategory={setSelectedSubcategory}
              onPriceFilterChange={(priceRange) => setPriceFilter(priceRange)}
            />
          </div>
        </div>

        {/* Backdrop for mobile filter */}
        {showFilters && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Product list */}
        <div className="w-full lg:w-3/4">
          <ProductList selectedSubcategory={selectedSubcategory} />
        </div>
      </div>
    </>
  );
};