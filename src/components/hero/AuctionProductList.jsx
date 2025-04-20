import { useState, useEffect } from "react";
import { Container, Heading } from "../../router";
import axios from "axios";
import { ProductCard } from "../cards/ProductCard";
import { Pagination } from "@mui/material";
import { Oval } from "react-loader-spinner";

export const AuctionProductList = ({ selectedSubcategory, priceRange }) => {
  const [postes, setPostes] = useState([]);
  const [filteredPostes, setFilteredPostes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPostes.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Charger les postes selon les filtres
  useEffect(() => {
    const fetchPostes = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        // On vérifie si une sous-catégorie est sélectionnée
        if (selectedSubcategory) {
          queryParams.append("scategorie_id", selectedSubcategory); // Ajouter le paramètre de sous-catégorie
        }

        // Si des prix sont fournis
        if (priceRange) {
          queryParams.append("min_price", priceRange[0]);
          queryParams.append("max_price", priceRange[1]);
        }

        // Si aucune sous-catégorie n'est sélectionnée, on appelle "allpostes"
        const endpoint =
          selectedSubcategory || priceRange
            ? `http://localhost:8000/api/postes?${queryParams.toString()}` // Filtres appliqués
            : `http://localhost:8000/api/allpostes`; // Pas de filtre, on récupère tous les postes

        const response = await axios.get(endpoint);
        setPostes(response.data);
        setFilteredPostes(response.data);
        setCurrentPage(1); // reset to first page on filter change
      } catch (error) {
        console.error("Erreur lors du chargement des postes :", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostes();
  }, [selectedSubcategory, priceRange]);

  // Recherche
  const handleSearch = (searchTerm) => {
    const filtered = postes.filter(
      (poste) =>
        poste.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poste.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPostes(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <section className="product-home">
      <Container>
        <Heading
          title="Our Auctions"
          subtitle="Explore the available auctions with our great offers."
        />

        {/* Search Bar */}
        <div className="mb-6 relative w-1/2">
          <input
            type="text"
            placeholder="Search postes..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Spinner */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Oval
              height={50}
              width={50}
              color="#f97316"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#fbbf24"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        ) : (
          <>
            {/* Postes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
              {currentPosts.length > 0 ? (
                currentPosts.map((item) => (
                  <ProductCard item={item} key={item.id} />
                ))
              ) : (
                <p>Aucun poste trouvé.</p>
              )}
            </div>

            {/* Pagination */}
            {filteredPostes.length > postsPerPage && (
              <div className="flex justify-center mt-8">
                <Pagination
                  count={Math.ceil(filteredPostes.length / postsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
};
