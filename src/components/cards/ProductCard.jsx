import PropTypes from "prop-types";
import { RiAuctionFill } from "react-icons/ri";
import { MdOutlineFavorite } from "react-icons/md";
import { Caption, SecondaryButton, ProfileCard, Title } from "../common/Design";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

// Fonction pour calculer le temps restant
const formatDuration = (endTime) => {
  const now = new Date();
  const timeRemaining = endTime - now;

  if (timeRemaining <= 0) return "0d : 0h : 0m : 0s";

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
};

export const ProductCard = ({ item }) => {
  const [remainingTime, setRemainingTime] = useState(formatDuration(new Date(item.duree)));
  const [loading, setLoading] = useState(true);

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // durée de chargement simulée : 1 seconde

    return () => clearTimeout(timer);
  }, []);

  // Mise à jour du compte à rebours
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(formatDuration(new Date(item.duree)));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [item.duree]);

  if (loading) {
    return (
      <div className="bg-white shadow-s1 rounded-xl p-5 flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg animate-pulse">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-s1 rounded-xl p-3">
      <div className="h-56 relative overflow-hidden">
        <NavLink to={`/details/${item.id}`}>
          <img
            src={item.photos}
            alt={item.titre}
            className="w-full h-full object-cover rounded-xl hover:scale-105 hover:cursor-pointer transition-transform duration-300 ease-in-out"
          />
        </NavLink>

        <ProfileCard className="shadow-s1 absolute right-3 bottom-3">
          <RiAuctionFill size={22} className="text-green" />
        </ProfileCard>

        <div className="absolute top-0 left-0 p-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Caption className="text-blue-500 bg-white px-3 py-1 text-sm rounded-full">
                {remainingTime || "0d : 0h : 0m : 0s"}
              </Caption>
              <Caption className="text-green bg-green_100 px-3 py-1 text-sm rounded-full">
                {item.estApprouvé ? "Approuvé" : "Non approuvé"}
              </Caption>
            </div>
          </div>
        </div>
      </div>

      <div className="details mt-4">
        <Title className="uppercase">{item.titre}</Title>
        <hr className="mt-3" />

        <div className="py-4">
          <p>{item.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div>
              <Caption className="text-green">Prix Initial</Caption>
              <Title>${item.prixIniale}.00</Title>
            </div>
          </div>
        </div>

        <hr className="mb-3" />

        <div className="flex items-center justify-between mt-3">
          <SecondaryButton className="rounded-md text-sm px-4 py-2">Add Bid</SecondaryButton>
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

// Gestion des favoris
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
    duree: PropTypes.string,
    estApprouvé: PropTypes.bool,
  }).isRequired,
};