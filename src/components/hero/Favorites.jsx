// src/pages/Favorites.jsx
import React, { useState, useEffect } from "react";
import { ProductCard } from "../cards/ProductCard";
import { Title } from "../common/Design";
import {  Container } from "../../router";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(savedFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
        <div className="bg-[#20354c] pt-8 min-h-[200px] relative">
                
        <Container className="px-4 sm:px-6 lg:px-8">
        <br />   <br />   <br />
        <div className="space-y-4">
            <Title level={3} className="text-white text-2xl sm:text-3xl">
              Favorites
            </Title>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Title level={5} className="text-white font-normal">
                Home
              </Title>
              <span className="text-white">/</span>
              <Title level={5} className="text-white font-normal">
                Auctions
              </Title>
              <span className="text-white">/</span>
              <Title level={5} className="text-white font-normal">
              Favorites
              </Title>
            </div>
          </div>
    
        </Container>
      </div>
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Title className="text-center mb-10 text-3xl font-bold text-neutral-800">
        ❤️ Favorite Auctions
      </Title>

      {loading ? (
        <div className="text-center text-gray-500 py-16 animate-pulse text-lg">
          Load Favorite Auctions...
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="w-full transform hover:scale-[1.02] transition-all duration-300 ease-in-out"
            >
              <div className="rounded-2xl shadow-md hover:shadow-xl bg-white border border-gray-100 overflow-hidden">
                <ProductCard item={item} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20 text-lg">
          No favorite positions at the moment.
        </div>
      )}
    </div>
    </>
  );
};

export default Favorites;