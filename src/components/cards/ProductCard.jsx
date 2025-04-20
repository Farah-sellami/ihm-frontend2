import PropTypes from "prop-types";
import { RiAuctionFill } from "react-icons/ri";
import { MdOutlineFavorite } from "react-icons/md";
import { Caption, SecondaryButton, ProfileCard, Title } from "../common/Design";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const formatDuration = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const timeRemaining = end - now;

  if (timeRemaining <= 0) return "Expired";

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
};

export const ProductCard = ({ item }) => {
  const [remainingTime, setRemainingTime] = useState(
    formatDuration(item.endDate)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(formatDuration(item.endDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [item.endDate]);

  return (
    <div className="bg-white shadow-s1 rounded-xl p-3 h-full flex flex-col">
      <div className="h-56 relative overflow-hidden flex-shrink-0">
        <NavLink to={`/details/${item.id}`}>
          <img
            src={item.photos[0]}
            alt={item.titre}
            className="w-full h-full object-cover rounded-xl hover:scale-105 hover:cursor-pointer transition-transform duration-300 ease-in-out"
          />
        </NavLink>

        <div className="absolute top-0 left-0 p-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Caption className="text-blue-500 bg-white px-3 py-1 text-sm rounded-full">
                {remainingTime}
              </Caption>
            </div>
          </div>
        </div>
      </div>

      <div className="details mt-4 flex-grow flex flex-col">
        <Title className="uppercase">{item.titre}</Title>
        <hr className="mt-3" />

        <div className="py-4 flex-grow">
          <p className="line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div>
              <Caption className="text-green">Prix Initial</Caption>
              <Title>${item.prixIniale}.00</Title>
            </div>
          </div>
        </div>

        <hr className="mb-3" />

        <div className="flex items-center justify-between mt-3">
          <SecondaryButton className="rounded-md text-sm px-4 py-2">
            Add Bid
          </SecondaryButton>
          <button
            onClick={() => handleFavorite(item)}
            className="border border-[#D47400] rounded-md p-2 bg-transparent hover:bg-[#FBF1E5] transition-colors duration-200"
          >
            <NavLink to="/favorites">
              <MdOutlineFavorite size={20} className="text-orange-500" />
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
};

const handleFavorite = (item) => {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.some((fav) => fav.id === item.id)) {
    favorites = favorites.filter((fav) => fav.id !== item.id);
  } else {
    favorites.push(item);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    photos: PropTypes.string,
    titre: PropTypes.string,
    description: PropTypes.string,
    prixIniale: PropTypes.number,
    endDate: PropTypes.string,
    estApprouvé: PropTypes.bool,
  }).isRequired,
};

// Nouveau composant pour la grille de produits
export const ProductGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
};

ProductGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    photos: PropTypes.string,
    titre: PropTypes.string,
    description: PropTypes.string,
    prixIniale: PropTypes.number,
    endDate: PropTypes.string,
    estApprouvé: PropTypes.bool,
  })).isRequired,
};