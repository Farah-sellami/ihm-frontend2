import { useEffect, useState } from "react";
import { Container, Heading } from "../../router";
import axios from "axios";
import { ProductCard } from "../cards/ProductCard";

export const ProductList = ({ selectedSubcategory, priceRange }) => {
  const [postes, setPostes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [scategories, setScategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScategory, setSelectedScategory] = useState("");

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
      } catch (error) {
        console.error("Erreur lors du chargement des postes :", error.message);
      }
    };

    fetchPostes();
  }, [selectedCategory, selectedScategory, selectedSubcategory, priceRange]);

  return (
    <section className="product-home">
      <Container>
        <Heading
          title="Nos Postes"
          subtitle="Explorez les postes disponibles avec nos magnifiques offres."
        />

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
          {postes.length > 0 ? (
            postes.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))
          ) : (
            <p>Aucun poste trouvé.</p>
          )}
        </div>
      </Container>
    </section>
  );
};
