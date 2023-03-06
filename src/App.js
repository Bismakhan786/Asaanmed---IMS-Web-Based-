import "./App.css";
import Header from "./components/Header/Header";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Login from "./components/Login/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Panels/Dashboard";
import { Provider } from "react-redux";
import store from "./Redux/store";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Users from "./components/Panels/Users/Users";
import Products from "./components/Panels/Products/Products";
import Orders from "./components/Panels/Orders/Orders";
import Categories from "./components/Panels/Categories/Categories";
import AdminProfile from "./components/Panels/AdminProfile";
import CreateProduct from "./components/Panels/Products/CreateProduct";
import CreateCategory from "./components/Panels/Categories/CreateCategory";
import ProductDetails from "./components/Panels/Products/ProductDetails";
import OrderDetails from "./components/Panels/Orders/OrderDetails";
import UserDetails from "./components/Panels/Users/UserDetails";
import CategoryDetails from "./components/Panels/Categories/CategoryDetails";
import Home from "./Home/Home";
import Footer from "./components/Footer/Footer";
import Media from "./components/Panels/Media/Media";

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
          <Route exact path="/about" element={<>
          <Header/>
          <About/>
          <Footer/>
          </>} />
          <Route exact path="/contact" element={<>
          <Header/>
          <Contact/>
          <Footer/>
          </>} />

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
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
