import {
  Body,
  Caption,
  Container,
  PrimaryButton,
  Title,
} from "../../router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from 'react-router-dom';

export const User1 = "https://cdn-icons-png.flaticon.com/128/6997/6997662.png";
export const User2 = "https://cdn-icons-png.flaticon.com/128/236/236832.png";
export const User3 = "https://cdn-icons-png.flaticon.com/128/236/236831.png";
export const User4 = "https://cdn-icons-png.flaticon.com/128/1154/1154448.png";

export const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
<section
  className="relative h-[500px] flex items-center justify-center pt-20"
  style={{
    background: "linear-gradient(180deg, #20354c 0%, #2e4966 50%, #3d5f80 100%)",
  }}
>
  <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>

  <div className="relative z-10 text-center text-white px-4 w-full max-w-3xl">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
      Discover Unique Auctions
    </h1>
    <p className="text-lg md:text-xl mb-6 text-gray-200">
      Bid on exclusive items and rare collectibles from verified sellers worldwide
    </p>
    <Link to="/Auctions">
    <button className="mb-6 px-6 py-3 text-base font-semibold rounded-xl border border-white text-white bg-white/10 hover:bg-white hover:text-[#20354c] transition duration-300">
  Explore Auctions
</button>
</Link>

    {/* Search bar */}
    <form className="w-full mt-2 px-4" onSubmit={(e) => e.preventDefault()}>
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search auctions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-4 pr-28 rounded-full text-black text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm"
        >
          Search
        </button>
      </div>
    </form>
  </div>
</section>

  );
};
