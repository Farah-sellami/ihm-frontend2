import { CategorySlider, Hero, Process } from "../../router";
import { ProductList } from "../../components/hero/ProductList";

export const Home = () => {
  return (
    <>
      
      <CategorySlider />
      <Hero />
      <Process />
      <ProductList />
      {/* <TopSeller /> */}
     
      {/* <Trust /> */}
      {/* <TopCollection /> */}
    </>
  );
};
