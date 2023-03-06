import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store";
import ProtectedRoute from "./Routes/ProtectedRoute";
import {
  About,
  AdminProfile,
  Categories,
  CategoryDetails,
  Contact,
  CreateCategory,
  CreateProduct,
  Dashboard,
  Home,
  Login,
  Media,
  NotFound,
  OrderDetails,
  Orders,
  ProductDetails,
  Products,
  UserDetails,
  Users,
} from "./pages";

function App() {
  // window.addEventListener("contextmenu", (e) => e.preventDefault())

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            exact
            path="/about"
            element={
              <>
                <Header />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            exact
            path="/contact"
            element={
              <>
                <Header />
                <Contact />
                <Footer />
              </>
            }
          />

          <Route exact path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route exact path="/admin/dashboard" element={<Dashboard />} />
            <Route exact path="/admin/media" element={<Media />} />
            <Route exact path="/admin/products" element={<Products />} />
            <Route
              exact
              path="/admin/products/details/:id"
              element={<ProductDetails />}
            />
            <Route
              exact
              path="/admin/products/new"
              element={<CreateProduct />}
            />
            <Route exact path="/admin/orders" element={<Orders />} />
            <Route
              exact
              path="/admin/orders/details/:id"
              element={<OrderDetails />}
            />
            <Route exact path="/admin/users" element={<Users />} />
            <Route
              exact
              path="/admin/users/details/:id"
              element={<UserDetails />}
            />
            <Route exact path="/admin/categories" element={<Categories />} />
            <Route
              exact
              path="/admin/categories/details/:id"
              element={<CategoryDetails />}
            />
            <Route
              exact
              path="/admin/categories/new"
              element={<CreateCategory />}
            />

            <Route exact path="/admin/profile" element={<AdminProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
