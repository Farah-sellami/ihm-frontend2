import { useState, useEffect } from "react";
import { Container, Heading } from "../../router";
import axios from "axios";
import { ProductCard } from "../cards/ProductCard";
import { Link } from "react-router-dom"; // Importer Link de react-router-dom pour gérer la navigation

export const AuctionProductList = ({ selectedSubcategory, priceRange }) => {
  const [postes, setPostes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [scategories, setScategories] = useState([]);
  const [filteredPostes, setFilteredPostes] = useState([]); // State to hold filtered postes
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScategory, setSelectedScategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Charger les catégories au démarrage
  useEffect(() => {
    axios.get("http://localhost:8000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Charger les sous-catégories dynamiquement quand une catégorie est sélectionnée
  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://localhost:8000/api/categories/${selectedCategory}/scategories`)
        .then(res => setScategories(res.data))
        .catch(err => console.error(err));
    } else {
      setScategories([]);
      setSelectedScategory("");
    }
  }, [selectedCategory]);

  // Fetch postes à chaque changement de filtre
  useEffect(() => {
    const fetchPostes = async () => {
      try {
        const queryParams = new URLSearchParams();

        // Sous-catégorie sélectionnée depuis les filtres dropdown
        if (selectedScategory) {
          queryParams.append("scategorie_id", selectedScategory);
        }

        // Sous-catégorie depuis les props
        if (selectedSubcategory) {
          queryParams.append("scategorie_id", selectedSubcategory);
        }

        // Plage de prix
        if (priceRange) {
          queryParams.append("min_price", priceRange[0]);
          queryParams.append("max_price", priceRange[1]);
        }

        const endpoint = queryParams.toString()
          ? `http://localhost:8000/api/allpostes?${queryParams.toString()}`
          : `http://localhost:8000/api/allpostes`;

        const response = await axios.get(endpoint);
        setPostes(response.data);
        setFilteredPostes(response.data); // Set filteredPostes to all postes initially
      } catch (error) {
        console.error("Erreur lors du chargement des postes :", error.message);
      }
    };

    fetchPostes();
  }, [selectedCategory, selectedScategory, selectedSubcategory, priceRange]);

  // Filter posts based on search term
  const handleSearch = () => {
    const filtered = postes.filter((poste) =>
      poste.titre.toLowerCase().includes(searchTerm.toLowerCase()) || // Filter by title
      poste.description.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by description
    );
    setFilteredPostes(filtered); // Set the filtered postes based on the search term
  };

  return (
    <section className="product-home">
      <Container>
        <Heading
          title="Featured Auctions"
          subtitle="Explorez les postes disponibles avec nos magnifiques offres."
        />

        {/* Search Bar */}
        <div className="mb-6 relative w-1/2">
          <input
            type="text"
            placeholder="Search postes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button 
            onClick={handleSearch} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
          >
            Search
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4 my-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>

          {selectedCategory && (
            <select
              value={selectedScategory}
              onChange={(e) => setSelectedScategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Toutes les sous-catégories</option>
              {scategories.map(scat => (
                <option key={scat.id} value={scat.id}>{scat.nom}</option>
              ))}
            </select>
          )}
        </div>

        {/* Postes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
          {filteredPostes.length > 0 ? (
            filteredPostes.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))
          ) : (
            <p>Aucun poste trouvé.</p>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-orange-500 hover:text-orange-600 font-semibold">
            View All
          </Link>
        </div>
      </Container>
    </section>
  );
};