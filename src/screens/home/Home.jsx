import { CategorySlider, Hero, Process } from "../../router";
import { ProductList } from "../../components/hero/ProductList";

export const Home = () => {
  return (
    <>
      <br /> 
      
      <Hero />
      <CategorySlider />
      <ProductList />
      <Process />
    </>
  );
};
