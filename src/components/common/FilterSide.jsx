import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

export const FilterSide = ({ subcategories, onSelectSubcategory, onPriceFilterChange }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    const updatedPriceRange = name === "min" ? [value, priceRange[1]] : [priceRange[0], value];
    setPriceRange(updatedPriceRange);
    onPriceFilterChange(updatedPriceRange); // Notify parent component of the price range change
  };
  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />

          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              {/* Filter content for mobile */}
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Subcategory Filter */}
              <div className="mt-4 px-4">
                <h3 className="font-semibold text-lg mb-4">Filter by Subcategory</h3>
                <ul className="space-y-2">
                  {subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <button
                        onClick={() => onSelectSubcategory(subcategory.id)}
                        className="text-gray-700 hover:text-blue-500"
                      >
                        {subcategory.titre}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="mt-6 px-4">
                <h3 className="font-semibold text-lg mb-4">Filter by Price</h3>
                <div className="flex items-center gap-4">
                  <div>
                    <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
                      Min Price
                    </label>
                    <input
                      id="min-price"
                      name="min"
                      type="number"
                      value={priceRange[0]}
                      onChange={handlePriceChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
                      Max Price
                    </label>
                    <input
                      id="max-price"
                      name="max"
                      type="number"
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Desktop filters */}
        <section className="sidebar p-6 w-full md:w-64 border-r border-gray-200 bg-white">
          <div className="hidden lg:block">
            <h3 className="font-semibold text-lg mb-4">Filter by Subcategory</h3>
            <ul className="space-y-2">
              {subcategories.map((subcategory) => (
                <li key={subcategory.id}>
                  <button
                    onClick={() => onSelectSubcategory(subcategory.id)}
                    className="text-gray-700 hover:text-blue-500"
                  >
                    {subcategory.titre}
                  </button>
                </li>
              ))}
            </ul>

            {/* Price Filter */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Filter by Price</h3>
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
                    Min Price
                  </label>
                  <input
                    id="min-price"
                    name="min"
                    type="number"
                    value={priceRange[0]}
                    onChange={handlePriceChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
                    Max Price
                  </label>
                  <input
                    id="max-price"
                    name="max"
                    type="number"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};