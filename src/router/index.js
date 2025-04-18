export { UserList } from "../admin/UserList";
export { NotFound } from "../components/common/NotFound";
export { WinningBidList } from "../screens/product/WinningBidList";
export { ScrollToTop } from "../utils/ScrollToTop";
export { PrivateRoute } from "./PrivateRoute";

// Home Section
export { CategoryCard } from "../components/cards/CategoryCard";
export { CategorySlider } from "../components/hero/CategorySlider";
export { Hero } from "../components/hero/Hero";
export { Process } from "../components/hero/Process";
export { TopCollection } from "../components/hero/TopCollection";
export { TopSeller } from "../components/hero/TopSeller";
export { Trust } from "../components/hero/Trust";
export { Home } from "../screens/home/Home";
export { default as Favorites } from "../components/hero/Favorites";  // Import et export par défaut

//Admin Product  Routes
export { Income } from "../admin/Income";
export { AdminProductList } from "../admin/product/AdminProductList";
export { UpdateProductByAdmin } from "../admin/product/UpdateProductByAdmin";
export { Dashboard } from "../screens/dashboard/Dashboard";

//Category  Routes
//export { CategoryList } from "../admin/category/CategoryList";
// export { CreateCategory } from "../admin/category/CreateCategory";
// export { UpdateCategory } from "../admin/category/UpdateCategory";

//sCategory  Routes
//export { SCategoryList } from "../admin/scategory/SCategoryList";
export { CategoryList } from '../admin/category/CategoryList';
export { SCategoryList } from '../admin/scategory/ScategoryList';

//Product Routes
export { AddProduct } from "../screens/product/AddProject";
export { ProductEdit } from "../screens/product/ProductEdit";
export { ProductList } from "../screens/product/productlist/ProductList";
export { ProductsDetailsPage } from "../screens/product/ProductsDetailsPage";

// Utilis Routes
export { DateFormatter } from "../utils/DateFormatter";

// Common Routes
export { CategoryDropDown } from "../components/common/CategoryDropDown";
export { Body, Caption, Container, CustomLink, CustomNavLink, CustomNavLinkList, Heading, PrimaryButton, ProfileCard, Title } from "../components/common/Design";
export { Loader } from "../components/common/Loader";
export { Search } from "../components/Search";
// export { ListAuction } from "../components/common/ListAuction";
export { ListAuction } from "../components/common/ListAuction";
// Layout Routes
export { DashboardLayout } from "../components/common/layout/DashboardLayout";
export { Layout } from "../components/common/layout/Layout";

// Hook Routes

// Auth Routes
export { Login } from "../screens/auth/Login";
export { LoginAsSeller } from "../screens/auth/LoginAsSeller";
export { Register } from "../screens/auth/Register";
export { UserProfile } from "../screens/auth/UserProfile";

