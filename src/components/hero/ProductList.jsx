import { useEffect, useState } from "react";
import { Container, Heading } from "../../router";
import { ProductCard } from "../cards/ProductCard";

export const ProductList = ({ selectedSubcategory, priceRange }) => {
  const [products, setProducts] = useState([]);

  // Fetch products based on the selected subcategory and price range
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();

        // Add subcategory filter if selected
        if (selectedSubcategory) {
          queryParams.append("scategorie_id", selectedSubcategory);
        }

        // Add price range filter if defined
        if (priceRange) {
          queryParams.append("min_price", priceRange[0]);
          queryParams.append("max_price", priceRange[1]);
        }

        const endpoint = `http://localhost:8000/api/postes?${queryParams.toString()}`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
  }, [selectedSubcategory, priceRange]);

  return (
    <>
      <section className="product-home">
        <Container>
          <Heading
            title="Live Auction"
            subtitle="Explore on the world's best & largest Bidding marketplace with our beautiful Bidding products. We want to be a part of your smile, success and future growth."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
            {products.length > 0 ? (
              products.map((item, index) => (
                <ProductCard item={item} key={index + 1} />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
};