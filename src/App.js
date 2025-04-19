import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AddProduct,
  AdminProductList,
  CategoryList,
 
  Dashboard,
  DashboardLayout,
  Home,
  Income,
  Layout,
  ListAuction,
  Login,
  LoginAsSeller,
  NotFound,
  PrivateRoute,
  ProductEdit,
  ProductList,
  ProductsDetailsPage,
  Register,
  SCategoryList,
  ScrollToTop,
  UpdateProductByAdmin,
  UserList,
  UserProfile,
  WinningBidList,
  Favorites
} from "./router/index.js";  
import AddPosteForm from "./components/common/AddPosteForm";

// Utilisation des composants importés dans ton code

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
              path="/create-auction"
              element={
                <Layout>
                  <AddPosteForm />
                </Layout>
              }
            />
             <Route
            path="/Auctions"
            element={
              <Layout>
                <ListAuction/>
              </Layout>
            }
          />
          <Route
          path="/favorites"
          element={
            <Layout>
              <Favorites />
            </Layout>
          }
        />

          <Route
            path="/login"
            element={
              // <Layout>
                <Login />
              // </Layout>
            }
          />
          <Route
            path="/seller/login"
            element={
              <PrivateRoute>
                <Layout>
                  <LoginAsSeller />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/register"
            element={
              // <Layout>
                <Register />
              // </Layout>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <AddProduct />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/income"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <Income />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/product/update/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <ProductEdit />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/details/:id"
            element={
              <Layout>
                <ProductsDetailsPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/product"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <ProductList />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/postes/admin"
            element={
              <PrivateRoute>
                <Layout>
                  {/* <DashboardLayout> */}
                    <AdminProductList />
                  {/* </DashboardLayout> */}
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/product/admin/update/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <UpdateProductByAdmin />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/userlist"
            element={
              <PrivateRoute>
                <Layout>
                  {/* <DashboardLayout> */}
                    <UserList />
                  {/* </DashboardLayout> */}
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/winning-products"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <WinningBidList />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <UserProfile />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/category"
            element={
              <PrivateRoute>
                <Layout>
                  {/* <DashboardLayout> */}
                    <CategoryList />
                  {/* </DashboardLayout> */}
                </Layout>
              </PrivateRoute>
            }
          />

          {/* <Route
            path="/category/update/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardLayout>
                    <UpdateCategory />
                  </DashboardLayout>
                </Layout>
              </PrivateRoute>
            }
          /> */}
                    <Route
            path="/scategory"
            element={
              <PrivateRoute>
                <Layout>
                  {/* <DashboardLayout> */}
                    <SCategoryList />
                  {/* </DashboardLayout> */}
                </Layout>
              </PrivateRoute>
            }
          />
    
          <Route
            path="/*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Toast Container pour afficher les notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
