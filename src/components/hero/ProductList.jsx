import { useState, useEffect } from "react";
import { Container, Heading } from "../../router"; // Ajuste si besoin
import axios from "axios";
import { ProductCard } from "../cards/ProductCard";
import { Link } from "react-router-dom";

export const ProductList = () => {
  const [postes, setPostes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/allpostes")
      .then((res) => {
        setPostes(res.data);
        console.log("Postes chargés :", res.data); // pour debug
      })
      .catch((err) => {
        console.error("Erreur de chargement :", err);
      });
  }, []);

  return (
    <section className="product-home py-4  bg-gray-100">
      <Container>
        <Heading
          title="Featured Auctions"
          subtitle="Explorez les postes disponibles avec nos magnifiques offres."
        />

        {/* Liste des 3 premiers postes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
          {postes.slice(0, 3).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
    {/* Bouton View All */}
    {postes.length > 1 && (
          <div className="text-right mt-6">
            <Link
              to="/auctions"
              className="inline-block bg-transparent text-blue-500 border border-blue-500 px-6 py-2 rounded-xl hover:bg-blue-100 hover:border-blue-600 transition"
            >
              View All
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
};
